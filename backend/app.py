import os
from pathlib import Path
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file, send_from_directory, redirect
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from db import get_db, init_db
from auth import hash_password, check_password, get_current_user, require_user, require_admin
from ocr import extract_text_from_pdf, parse_routes, grade_sort_key, GRADE_PATTERN, FRENCH_ORDER
from audit import log_change
from thecrag_parser import parse_thecrag_html, fetch_thecrag_html
from itsdangerous import URLSafeTimedSerializer
import re
import unicodedata
import seed
from PIL import Image
from fzf import fuzzy_search
import smtplib
import ssl
from email.message import EmailMessage

jwt_secret = os.environ.get('JWT_SECRET')
if not jwt_secret:
    raise RuntimeError("JWT_SECRET environment variable is required")

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost,capacitor://localhost')
CORS(app, resources={r"/api/*": {"origins": [o.strip() for o in CORS_ORIGINS.split(',') if o.strip()]}}, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = jwt_secret
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config["JWT_BLOCKLIST_ENABLED"] = True
app.config["JWT_BLOCKLIST_TOKEN_CHECKS"] = ["access"]
jwt = JWTManager(app)

limiter = Limiter(app=app, key_func=get_remote_address)

UPLOAD_FOLDER = Path('/app/uploads')
UPLOAD_FOLDER.mkdir(exist_ok=True)
PHOTO_FOLDER = UPLOAD_FOLDER / 'route_photos'
PHOTO_FOLDER.mkdir(exist_ok=True)

# ── EMAIL CONFIG ───────────────────────────────────────────────────────────────
SMTP_HOST = os.environ.get('SMTP_HOST', '')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASS = os.environ.get('SMTP_PASS', '')
MAIL_FROM = os.environ.get('MAIL_FROM', 'noreply@cragmaster')
APP_URL   = os.environ.get('APP_URL', '')

def send_email(to, subject, text):
    if not SMTP_HOST:
        return False
    msg = EmailMessage()
    msg['From']    = MAIL_FROM
    msg['To']      = to
    msg['Subject'] = subject
    msg.set_content(text)
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            if SMTP_USER and SMTP_PASS:
                server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        return True
    except Exception:
        return False

reset_serializer = URLSafeTimedSerializer(jwt_secret, salt='password-reset')

# ── TOKEN REVOCATION ──────────────────────────────────────────────────────────
@jwt.token_in_blocklist_loader
def check_token_revoked(jwt_header, jwt_payload):
    user_id = jwt_payload.get('sub')
    token_ver = jwt_payload.get('ver', 0)
    if not user_id:
        return True
    conn = get_db()
    user = conn.execute('SELECT token_version FROM users WHERE id=?', (int(user_id),)).fetchone()
    conn.close()
    return not user or token_ver < user['token_version']

# ── HELPERS ───────────────────────────────────────────────────────────────────
def api_error(msg, code=400):
    return jsonify({'error': msg}), code
def ok(data=None, **kwargs):
    if data is None: data = kwargs
    return jsonify(data)

# ── STATIC / SPA ──────────────────────────────────────────────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def spa(path):
    if path.startswith('api/'): return api_error('Not found', 404)
    return send_from_directory('static', 'index.html')

# ── AUTH ──────────────────────────────────────────────────────────────────────

# ── PING ──────────────────────────────────────────────────────────────────────
@app.route('/api/ping')
def ping():
    conn = get_db()
    row = conn.execute('SELECT online FROM online WHERE id=1').fetchone()
    conn.close()
    return ok(online=bool(row['online']) if row else True)
# ───────────────────────────────────────────────────────────────────────────────

@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("4 per minute")
def login():
    d = request.get_json() or {}
    username = (d.get('username') or '').strip()
    password = (d.get('password') or '').strip()
    remember = d.get('remember', False)
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE username=?', (username,)).fetchone()
    conn.close()
    if not user or not check_password(password, user['password_hash']):
        return api_error('Invalid username or password', 401)
    if user['banned_until']:
        try:
            ban_end = datetime.fromisoformat(user['banned_until'])
            if ban_end > datetime.now():
                return api_error('Account is banned', 403)
        except (ValueError, TypeError):
            pass
    expires = timedelta(days=30) if remember else timedelta(hours=24)
    token = create_access_token(identity=str(user['id']), additional_claims={"ver": user['token_version']}, expires_delta=expires)
    return ok(token=token, user={'id': user['id'], 'username': user['username'], 'is_admin': bool(user['is_admin']), 'email': user['email'] or '', 'email_prompt_dismissed': bool(user['email_prompt_dismissed'])})

# ── PASSWORD RESET ──────────────────────────────────────────────────────────
@app.route('/api/auth/forgot-password', methods=['POST'])
@limiter.limit("3 per minute")
def forgot_password():
    d = request.get_json() or {}
    email = (d.get('email') or '').strip().lower()
    if not email:
        return api_error('Email is required')

    if not SMTP_HOST:
        return api_error('Password reset is not configured (SMTP not set up)', 501)

    conn = get_db()
    user = conn.execute('SELECT id FROM users WHERE email=?', (email,)).fetchone()
    conn.close()

    if user:
        token = reset_serializer.dumps(str(user['id']))
        reset_url = f"{APP_URL}/forgot-password?token={token}"
        text = (
            f"Hello,\n\n"
            f"Someone requested a password reset for your CragMaster account.\n\n"
            f"Click the link below to reset your password (valid for 15 minutes):\n{reset_url}\n\n"
            f"If you didn't request this, you can safely ignore this email.\n\n"
            f"— CragMaster"
        )
        send_email(email, 'CragMaster — Password Reset', text)

    return ok(sent=True)

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    d = request.get_json() or {}
    token   = (d.get('token') or '').strip()
    new_pwd = (d.get('password') or '').strip()
    if not token or not new_pwd:
        return api_error('Token and password are required')

    try:
        user_id = reset_serializer.loads(token, max_age=900)
    except Exception:
        return api_error('Invalid or expired reset token', 400)

    conn = get_db()
    user = conn.execute('SELECT id FROM users WHERE id=?', (int(user_id),)).fetchone()
    if not user:
        conn.close()
        return api_error('User not found', 404)

    conn.execute(
        'UPDATE users SET password_hash=?, token_version=token_version+1 WHERE id=?',
        (hash_password(new_pwd), user['id'])
    )
    conn.commit()
    conn.close()
    return ok(reset=True)

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def me():
    user = get_current_user()
    if not user: return api_error('Not found', 404)
    return ok(user={'id': user['id'], 'username': user['username'], 'is_admin': bool(user['is_admin']), 'email': user['email'] or '', 'email_prompt_dismissed': bool(user['email_prompt_dismissed'])})

@app.route('/api/auth/me', methods=['PATCH'])
@jwt_required()
def update_me():
    user = require_user()
    d = request.get_json() or {}
    current_password = (d.get('current_password') or '').strip()
    new_username = (d.get('username') or '').strip()
    new_password = (d.get('password') or '').strip()
    new_email    = (d.get('email') or '').strip().lower()

    # Allow dismissing the email prompt without current password
    if 'email_prompt_dismissed' in d:
        conn = get_db()
        conn.execute('UPDATE users SET email_prompt_dismissed=1 WHERE id=?', (user['id'],))
        conn.commit()
        updated = conn.execute('SELECT id, username, is_admin, token_version, email, email_prompt_dismissed FROM users WHERE id=?', (user['id'],)).fetchone()
        conn.close()
        return ok(user={'id': updated['id'], 'username': updated['username'], 'is_admin': bool(updated['is_admin']), 'email': updated['email'] or '', 'email_prompt_dismissed': bool(updated['email_prompt_dismissed'])})

    # Allow setting email without current password (user just logged in)
    if 'email' in d and new_username == user['username'] and not new_password:
        conn = get_db()
        conn.execute('UPDATE users SET email=? WHERE id=?', (new_email or None, user['id']))
        conn.commit()
        updated = conn.execute('SELECT id, username, is_admin, token_version, email, email_prompt_dismissed FROM users WHERE id=?', (user['id'],)).fetchone()
        conn.close()
        return ok(user={'id': updated['id'], 'username': updated['username'], 'is_admin': bool(updated['is_admin']), 'email': updated['email'] or '', 'email_prompt_dismissed': bool(updated['email_prompt_dismissed'])})

    if not current_password:
        return api_error('Current password is required')
    if not check_password(current_password, user['password_hash']):
        return api_error('Current password is incorrect', 403)

    if not new_username:
        return api_error('Username cannot be empty')

    conn = get_db()
    conflict = conn.execute(
        'SELECT id FROM users WHERE username=? AND id!=?',
        (new_username, user['id'])
    ).fetchone()
    if conflict:
        conn.close()
        return api_error('Username already taken', 409)

    if new_password:
        conn.execute(
            'UPDATE users SET username=?, password_hash=?, token_version=token_version+1, email=? WHERE id=?',
            (new_username, hash_password(new_password), new_email or None, user['id'])
        )
    else:
        conn.execute(
            'UPDATE users SET username=?, email=? WHERE id=?',
            (new_username, new_email or None, user['id'])
        )

    conn.commit()
    updated = conn.execute('SELECT id, username, is_admin, token_version, email, email_prompt_dismissed FROM users WHERE id=?', (user['id'],)).fetchone()
    conn.close()
    new_token = create_access_token(identity=str(updated['id']), additional_claims={"ver": updated['token_version']})
    return ok(user={'id': updated['id'], 'username': updated['username'], 'is_admin': bool(updated['is_admin']), 'email': updated['email'] or '', 'email_prompt_dismissed': bool(updated['email_prompt_dismissed'])}, token=new_token)

# ── ADMIN: USER MANAGEMENT ────────────────────────────────────────────────────
@app.route('/api/users', methods=['GET'])
@jwt_required()
def list_users():
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    conn = get_db()
    rows = conn.execute('SELECT id, username, is_admin FROM users').fetchall()
    conn.close()
    return ok([dict(r) for r in rows])

@app.route('/api/users', methods=['POST'])
@jwt_required()
def create_user():
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    username = (d.get('username') or '').strip()
    password = (d.get('password') or '').strip()
    email    = (d.get('email') or '').strip().lower()
    is_admin = bool(d.get('is_admin', False))
    if not username or not password: return api_error('Username and password required')
    if is_admin and not user['is_admin']:
        return api_error('Only admins can create admin accounts', 403)
    conn = get_db()
    try:
        conn.execute('INSERT INTO users (username, password_hash, is_admin, email) VALUES (?,?,?,?)', (username, hash_password(password), int(is_admin), email or None))
        conn.commit()
        u = conn.execute('SELECT id, username, is_admin, email FROM users WHERE username=?', (username,)).fetchone()
        return ok(dict(u)), 201
    except Exception:
        return api_error('Username already taken', 409)
    finally: conn.close()



@app.route('/api/users/<int:uid>', methods=['DELETE'])
@jwt_required()
def delete_user(uid):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    me = get_current_user()
    if me['id'] == uid: return api_error('Cannot delete yourself')
    conn = get_db()
    conn.execute('DELETE FROM users WHERE id=?', (uid,))
    conn.commit()
    conn.close()
    return ok(deleted=True)

# ── PUBLIC USER PROFILE ──────────────────────────────────────────────────────
@app.route('/api/users/<int:uid>/public', methods=['GET'])
@jwt_required()
def get_public_user(uid):
    conn = get_db()
    user = conn.execute('SELECT id, username, is_admin FROM users WHERE id=?', (uid,)).fetchone()
    conn.close()
    if not user: return api_error('User not found', 404)
    return ok(id=user['id'], username=user['username'], is_admin=bool(user['is_admin']))

# ── USER REPORT ───────────────────────────────────────────────────────────────
@app.route('/api/report/user/<int:uid>', methods=['POST'])
@jwt_required()
def report_user(uid):
    reporter = require_user()
    d = request.get_json() or {}
    reason = (d.get('reason') or '').strip()
    if not reason:
        return api_error('Reason is required', 400)
    conn = get_db()
    target = conn.execute('SELECT id, username FROM users WHERE id=?', (uid,)).fetchone()
    if not target:
        conn.close(); return api_error('User not found', 404)
    if target['id'] == reporter['id']:
        conn.close(); return api_error('Cannot report yourself', 400)

    cur = conn.execute(
        'INSERT INTO oops_reports (user_id, explanation, concerned_user) VALUES (?,?,?)',
        (reporter['id'], f'Reported user @{target["username"]} (ID #{target["id"]}): {reason}', target['username'])
    )
    log_change(conn, 'oops_reports', cur.lastrowid, 'insert', reporter['id'],
               summary=f'User report: @{target["username"]}: {reason[:80]}')
    conn.commit()
    conn.close()
    return ok(submitted=True), 201

# ── TOPOS ─────────────────────────────────────────────────────────────────────
@app.route('/api/topos', methods=['get'])
@jwt_required()
def list_topos():
    conn = get_db()
    rows = conn.execute('''SELECT * FROM topos ORDER BY title''').fetchall()
    conn.close()
    return ok([dict(r) for r in rows])

@app.route('/api/topos/<int:topo_id>', methods=['GET'])
@jwt_required()
def get_topo(topo_id):
    conn = get_db()
    topo = conn.execute('''SELECT * FROM topos WHERE id=?''', (topo_id,)).fetchone()
    if not topo: conn.close(); return api_error('Topo not found', 404)
    routes = conn.execute('''SELECT * FROM routes WHERE topo_id=? ORDER BY route_index''', (topo_id,)).fetchall()
    parking_location = conn.execute('SELECT parking_lat as lat, parking_lon as lon FROM topos WHERE id=?', (topo_id,)).fetchone()
    routes_location = conn.execute('SELECT routes_lat as lat, routes_lon as lon FROM topos WHERE id=?', (topo_id,)).fetchone()
    tags = conn.execute('SELECT t.id, t.name, t.name_fr, t.category FROM tag_topos tt JOIN tags t ON tt.tag_id=t.id WHERE tt.topo_id=?', (topo_id,)).fetchall()

    # Aggregate route tags for style breakdown (route_style, hold, style categories)
    route_tag_stats = conn.execute('''
        SELECT t.category, t.name, t.name_fr, COUNT(*) as count
        FROM tag_routes tr
        JOIN tags t ON t.id = tr.tag_id
        JOIN routes r ON r.id = tr.route_id
        WHERE r.topo_id = ?
        GROUP BY t.id
        ORDER BY t.category, count DESC
    ''', (topo_id,)).fetchall()

    conn.close()
    return ok(topo=dict(topo), routes=[dict(r) for r in routes], tags=[dict(t) for t in tags], route_tag_stats=[dict(r) for r in route_tag_stats], parking_location=dict(parking_location), routes_location=dict(routes_location))

@app.route('/api/topos/<int:topo_id>/download')
@jwt_required()
def serve_pdf(topo_id):
    conn = get_db()
    row = conn.execute('SELECT filename FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    if not row: return api_error('Not found', 404)
    fn = row['filename']
    if fn.startswith('http'):
        return redirect(fn)
    path = UPLOAD_FOLDER / fn
    mime = 'application/pdf' if path.suffix.lower() == '.pdf' else 'text/html'
    return send_file(path, mimetype=mime, download_name=fn, as_attachment=True)


@app.route('/api/topos/upload', methods=['POST'])
@jwt_required()
def upload_topo():
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    if 'pdf' not in request.files: return api_error('No PDF file provided')
    f = request.files['pdf']

    # Strip path separators to prevent traversal
    safe_filename = Path(f.filename).name
    if not safe_filename.lower().endswith('.pdf'):
        return api_error('File must have a .pdf extension', 400)

    raw = f.read()
    if not raw.startswith(b'%PDF'):
        return api_error('File is not a valid PDF', 400)

    # Check for duplicate before writing to disk
    conn = get_db()
    existing = conn.execute('SELECT id FROM topos WHERE filename=?', (safe_filename,)).fetchone()
    if existing:
        conn.close()
        return api_error('This PDF is already in the library', 409)

    title = (request.form.get('title') or '').strip() or Path(safe_filename).stem
    dest = UPLOAD_FOLDER / safe_filename
    dest.write_bytes(raw)

    ocr_text = extract_text_from_pdf(str(dest))
    cursor = conn.execute('INSERT INTO topos (filename, title, uploaded_by) VALUES (?,?,?)', (safe_filename, title, user['id']))
    topo_id = cursor.lastrowid
    parsed = parse_routes(ocr_text, topo_id)
    for r in parsed:
        conn.execute('INSERT INTO routes (topo_id, name, grade, sorting_grade, route_index, length) VALUES (?,?,?,?,?,?)', (topo_id, r['name'], r['grade'], r['sorting_grade'], r['index'], r['length']))
    log_change(conn, 'topos', topo_id, 'insert', user['id'], summary=f'Uploaded topo "{title}" ({len(parsed)} routes)')
    conn.commit()
    conn.close()
    return ok(routes_parsed=len(parsed)), 201

@app.route('/api/topos/import/thecrag', methods=['POST'])
@jwt_required()
def import_thecrag():
    user = get_current_user()
    if not user:
        return api_error('Authentication required', 401)
    if 'file' not in request.files:
        return api_error('No HTML file provided')
    f = request.files['file']
    if not f.filename:
        return api_error('Empty filename')

    raw = f.read()
    try:
        content = raw.decode('utf-8')
    except UnicodeDecodeError:
        return api_error('File must be UTF-8 encoded HTML')

    try:
        parsed = parse_thecrag_html(content)
    except ValueError as e:
        return api_error(str(e))

    topo_data = parsed['topo']
    title = (request.form.get('title') or '').strip() or topo_data['title']
    filename = Path(f.filename).name
    dest = UPLOAD_FOLDER / filename
    dest.write_bytes(raw)

    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO topos (filename, title, uploaded_by) VALUES (?,?,?)',
        (filename, title, user['id'])
    )
    topo_id = cursor.lastrowid

    for r in parsed['routes']:
        conn.execute(
            'INSERT INTO routes (topo_id, name, grade, sorting_grade, route_index, length) VALUES (?,?,?,?,?,?)',
            (topo_id, r['name'], r['grade'], r['sorting_grade'], r['route_index'], r['length'])
        )
    log_change(conn, 'topos', topo_id, 'insert', user['id'], summary=f'Imported topo "{title}" from theCrag ({len(parsed["routes"])} routes)')
    conn.commit()
    conn.close()

    return ok(topo_id=topo_id, topo_name=title, routes_parsed=len(parsed['routes'])), 201


@app.route('/api/topos/import/thecrag/url', methods=['POST'])
@jwt_required()
def import_thecrag_url():
    user = get_current_user()
    if not user:
        return api_error('Authentication required', 401)
    d = request.get_json() or {}
    url = (d.get('url') or '').strip()
    if not url:
        return api_error('URL is required')
    if not url.startswith('https://www.thecrag.com/'):
        return api_error('Only theCrag.com URLs are supported')

    try:
        _, parsed = fetch_thecrag_html(url)
    except ValueError as e:
        return api_error(str(e))
    except Exception as e:
        return api_error(f'Failed to fetch URL: {e}')

    topo_data = parsed['topo']
    title = (d.get('title') or '').strip() or topo_data['title']

    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO topos (filename, title, uploaded_by) VALUES (?,?,?)',
        (url, title, user['id'])
    )
    topo_id = cursor.lastrowid

    for r in parsed['routes']:
        conn.execute(
            'INSERT INTO routes (topo_id, name, grade, sorting_grade, route_index, length) VALUES (?,?,?,?,?,?)',
            (topo_id, r['name'], r['grade'], r['sorting_grade'], r['route_index'], r['length'])
        )
    log_change(conn, 'topos', topo_id, 'insert', user['id'], summary=f'Imported topo "{title}" from theCrag URL ({len(parsed["routes"])} routes)')
    conn.commit()
    conn.close()

    return ok(topo_id=topo_id, topo_name=title, routes_parsed=len(parsed['routes'])), 201


@app.route('/api/topos/create', methods=['POST'])
@jwt_required()
def create_topo():
    """Create an empty topo with just a title (no PDF)."""
    user = get_current_user()
    if not user:
        return api_error('Authentication required', 401)
    d = request.get_json() or {}
    title = (d.get('title') or '').strip()
    if not title:
        return api_error('Title is required', 400)
    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO topos (filename, title, uploaded_by) VALUES (?,?,?)',
        ('', title, user['id'])
    )
    topo_id = cursor.lastrowid
    log_change(conn, 'topos', topo_id, 'insert', user['id'], summary=f'Created blank topo "{title}"')
    conn.commit()
    topo = conn.execute('SELECT * FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    return ok(topo=dict(topo)), 201


@app.route('/api/topos/<int:topo_id>', methods=['PATCH'])
@jwt_required()
def update_topo(topo_id):
    conn = get_db()
    topo = conn.execute('SELECT * FROM topos WHERE id=?', (topo_id,)).fetchone()
    if not topo: conn.close(); return api_error('Topo not found', 404)
    data = request.get_json(silent=True) or {}
    title = data.get('title', '').strip()
    if not title: conn.close(); return api_error('Title is required', 400)
    old_title = topo['title']
    conn.execute('UPDATE topos SET title=? WHERE id=?', (title, topo_id))
    if title != old_title:
        log_change(conn, 'topos', topo_id, 'update', int(get_jwt_identity()), 'title', old_title, title)
    conn.commit(); conn.close()
    return ok(title=title)

@app.route('/api/topos/<int:topo_id>', methods=['DELETE'])
@jwt_required()
def delete_topo(topo_id):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    conn = get_db()
    topo = conn.execute('SELECT title FROM topos WHERE id=?', (topo_id,)).fetchone()
    title = topo['title'] if topo else 'unknown'
    conn.execute('DELETE FROM topos WHERE id=?', (topo_id,))
    log_change(conn, 'topos', topo_id, 'delete', int(get_jwt_identity()), summary=f'Deleted topo "{title}"')
    conn.commit(); conn.close()
    return ok(deleted=True)

@app.route('/api/topos/<int:topo_id>/add_route', methods=['POST'])
@jwt_required()
def add_route(topo_id):
    conn = get_db()
    d = request.get_json() or {}
    name = (d.get('name') or '').strip()
    grade = (d.get('grade') or '').strip()
    length = d.get('length')
    route_index = d.get('route_index')
    if not route_index:
        return api_error('Route index cannot be empty')
    if not length:
        length = -1
    try:
        length = float(length)
    except (ValueError, TypeError):
        return api_error('Length must be a number')
    try:
        route_index = int(route_index)
    except (ValueError, TypeError):
        return api_error('Route index must be a number')
    cursor = conn.execute('SELECT id FROM topos WHERE id=?', (topo_id,)).fetchone()
    if not cursor:
        return api_error('Topo not found', 404)
    cursor = conn.execute('SELECT id FROM routes WHERE topo_id=? AND route_index=? AND name=?', (topo_id, route_index, name)).fetchone()
    if cursor:
        return api_error('Route already exists', 409)
    cur = conn.execute('INSERT INTO routes (topo_id, name, grade, sorting_grade, length, route_index) VALUES (?,?,?,?,?,?)', (topo_id, name, grade, grade_sort_key(grade), length, route_index))
    route_id = cur.lastrowid
    log_change(conn, 'routes', route_id, 'insert', int(get_jwt_identity()), summary=f'Added route "{name}" ({grade}) to topo #{topo_id}')
    conn.commit()
    routes = conn.execute('''SELECT * FROM routes WHERE topo_id=? ORDER BY route_index''', (topo_id,)).fetchall()
    conn.close()
    return ok(routes=[dict(r) for r in routes])

@app.route('/api/topos/<int:topo_id>/set_location_parking', methods=['POST'])
@jwt_required()
def set_location_parking(topo_id):
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    lat = (d.get('lat') or '')
    lon = (d.get('lon') or '')
    if not lat or not lon: return api_error('Error when setting parking location')
    conn = get_db()
    cursor = conn.execute('SELECT id, parking_lat, parking_lon FROM topos WHERE id=?', (topo_id,)).fetchone()
    if not cursor:
        conn.close(); return api_error('Topo not found', 404)
    if cursor['parking_lat']: return api_error('Parking location already set', 409)
    old = f'{cursor["parking_lat"]},{cursor["parking_lon"]}' if cursor["parking_lat"] else 'none'
    conn.execute('UPDATE topos SET parking_lat=?, parking_lon=? WHERE id=?', (lat, lon, topo_id))
    log_change(conn, 'topos', topo_id, 'update', user['id'], 'parking_location', old, f'{lat},{lon}')
    conn.commit()
    parking_location = conn.execute('SELECT parking_lat, parking_lon FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    return ok(parking_location=dict(parking_location))

@app.route('/api/topos/<int:topo_id>/set_location_routes', methods=['POST'])
@jwt_required()
def set_location_routes(topo_id):
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    lat = (d.get('lat') or '')
    lon = (d.get('lon') or '')
    if not lat or not lon: return api_error('Error when setting routes location')
    conn = get_db()
    cursor = conn.execute('SELECT id, routes_lat, routes_lon FROM topos WHERE id=?', (topo_id,)).fetchone()
    if not cursor:
        conn.close(); return api_error('Topo not found', 404)
    if cursor['routes_lat']: return api_error('Routes location already set', 409)
    old = f'{cursor["routes_lat"]},{cursor["routes_lon"]}' if cursor["routes_lat"] else 'none'
    conn.execute('UPDATE topos SET routes_lat=?, routes_lon=? WHERE id=?', (lat, lon, topo_id))
    log_change(conn, 'topos', topo_id, 'update', user['id'], 'routes_location', old, f'{lat},{lon}')
    conn.commit()
    routes_location = conn.execute('SELECT routes_lat, routes_lon FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    return ok(routes_location=dict(routes_location))

@app.route('/api/topos/<int:topo_id>/location', methods=['PUT'])
@jwt_required()
def update_location(topo_id):
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    lat = d.get('lat')
    lon = d.get('lon')
    loc_type = d.get('type')
    if not lat or not lon or loc_type not in ('parking', 'routes'):
        return api_error('Invalid request. Provide lat, lon, and type ("parking" or "routes")')
    conn = get_db()
    cursor = conn.execute('SELECT id FROM topos WHERE id=?', (topo_id,)).fetchone()
    if not cursor:
        conn.close(); return api_error('Topo not found', 404)
    lat_col = f'{loc_type}_lat'
    lon_col = f'{loc_type}_lon'
    old_row = conn.execute(f'SELECT {lat_col}, {lon_col} FROM topos WHERE id=?', (topo_id,)).fetchone()
    old = f'{old_row[lat_col]},{old_row[lon_col]}' if old_row[lat_col] else 'none'
    conn.execute(f'UPDATE topos SET {lat_col}=?, {lon_col}=? WHERE id=?', (lat, lon, topo_id))
    log_change(conn, 'topos', topo_id, 'update', user['id'], f'{loc_type}_location', old, f'{lat},{lon}')
    conn.commit()
    conn.close()
    return ok(message=f'{loc_type} location updated')

# ── ROUTES ────────────────────────────────────────────────────────────────────
@app.route('/api/routes/generate-passphrase')
def generate_passphrase():
    conn = get_db()
    def strip_accents(s):
        return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.category(c).startswith('M'))
    words = []
    while len(words) < 2:
        row = conn.execute('SELECT name FROM routes ORDER BY RANDOM() LIMIT 1').fetchone()
        if not row: continue
        name = row['name']
        longest = max(name.split(), key=len) if name.split() else ''
        clean = strip_accents(longest)
        if clean.isalpha():
            words.append(clean.lower())
    conn.close()
    return ok(passphrase='-'.join(words))

@app.route('/api/routes/<int:route_id>', methods=['GET'])
@jwt_required()
def get_route(route_id):
    user = get_current_user()
    conn = get_db()
    route = conn.execute('''SELECT r.*, t.title as topo_title, t.id as topo_id FROM routes r JOIN topos t ON t.id = r.topo_id WHERE r.id=?''', (route_id,)).fetchone()
    if not route: conn.close(); return api_error('Route not found', 404)
    comments = conn.execute('''SELECT c.*, u.username FROM comments c JOIN users u ON u.id = c.user_id WHERE c.route_id=? ORDER BY c.created_at DESC''', (route_id,)).fetchall()
    attempt = []
    is_project = False
    project_sent = False
    if user:
        attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user['id'], route_id)).fetchone()
        proj = conn.execute('SELECT sent FROM projects WHERE user_id=? AND route_id=?', (user['id'], route_id)).fetchone()
        if proj:
            is_project = True
            project_sent = bool(proj['sent'])
    tags = conn.execute('SELECT t.id, t.name, t.name_fr, t.category FROM tag_routes tr JOIN tags t ON tr.tag_id=t.id WHERE tr.route_id=?', (route_id,)).fetchall()

    # Batch-fetch attempt & project status for every commenter
    commenter_ids = list({c['user_id'] for c in comments})
    commenter_attempts = {}
    commenter_projects = set()
    if commenter_ids:
        placeholders = ','.join('?' * len(commenter_ids))
        for row in conn.execute(f'SELECT user_id, sent FROM attempts WHERE route_id=? AND user_id IN ({placeholders})', (route_id, *commenter_ids)):
            commenter_attempts[row['user_id']] = bool(row['sent'])
        for row in conn.execute(f'SELECT user_id FROM projects WHERE route_id=? AND user_id IN ({placeholders})', (route_id, *commenter_ids)):
            commenter_projects.add(row['user_id'])

    conn.close()

    # Average perceived grade from comments
    avg_perceived = None
    grades = []
    for c in comments:
        pg = c['perceived_grade']
        if pg:
            sg = grade_sort_key(pg)
            if sg >= 0:
                grades.append(sg)
    if grades:
        avg = round(sum(grades) / len(grades))
        if 0 <= avg < len(FRENCH_ORDER):
            avg_perceived = FRENCH_ORDER[avg]

    comments_out = []
    for c in comments:
        cd = dict(c)
        uid = c['user_id']
        if uid in commenter_attempts and commenter_attempts[uid]:
            cd['user_status'] = 'sent'
        elif uid in commenter_projects:
            cd['user_status'] = 'project'
        elif uid in commenter_attempts:
            cd['user_status'] = 'working'
        else:
            cd['user_status'] = None
        comments_out.append(cd)

    route_dict = dict(route)
    has_photo = bool(route_dict.get('photo'))
    return ok(route=route_dict, comments=comments_out, attempt=dict(attempt) if attempt else None, tags=[dict(t) for t in tags], avg_perceived_grade=avg_perceived, is_project=is_project, project_sent=project_sent, has_photo=has_photo)

@app.route('/api/routes/<int:route_id>', methods=['PATCH'])
@jwt_required()
def update_route(route_id):
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}

    name  = (d.get('name')  or '').strip()
    grade = (d.get('grade') or '').strip()
    length = d.get('length')
    route_index = d.get('route_index')

    if not name:
        return api_error('Name cannot be empty')

    if grade and not re.match(GRADE_PATTERN, grade, re.IGNORECASE):
        return api_error('Invalid grade format')

    sorting = grade_sort_key(grade) if grade else -1

    try:
        length = float(length) if length not in (None, '', '-1') else -1
    except (ValueError, TypeError):
        length = -1

    try:
        route_index = int(route_index) if route_index not in (None, '', '-1') else -1
    except (ValueError, TypeError):
        route_index = -1

    conn = get_db()
    route = conn.execute('SELECT * FROM routes WHERE id=?', (route_id,)).fetchone()
    if not route:
        conn.close(); return api_error('Route not found', 404)

    uid = user['id']
    if name != route['name']:
        log_change(conn, 'routes', route_id, 'update', uid, 'name', route['name'], name)
    if grade != route['grade']:
        log_change(conn, 'routes', route_id, 'update', uid, 'grade', route['grade'], grade)
    if length != route['length']:
        log_change(conn, 'routes', route_id, 'update', uid, 'length', str(route['length']), str(length))
    if route_index != route['route_index']:
        log_change(conn, 'routes', route_id, 'update', uid, 'route_index', str(route['route_index']), str(route_index))

    conn.execute(
        'UPDATE routes SET name=?, grade=?, sorting_grade=?, length=?, route_index=? WHERE id=?',
        (name, grade, sorting, length, route_index, route_id)
    )
    conn.commit()
    updated = conn.execute(
        'SELECT r.*, t.title as topo_title, t.id as topo_id '
        'FROM routes r JOIN topos t ON t.id = r.topo_id WHERE r.id=?',
        (route_id,)
    ).fetchone()
    conn.close()
    return ok(route=dict(updated))

# ── ROUTE PHOTOS ────────────────────────────────────────────────────────────
ALLOWED_PHOTO_TYPES = {'image/jpeg', 'image/png', 'image/webp'}

@app.route('/api/routes/<int:route_id>/photo', methods=['POST'])
@jwt_required()
def upload_route_photo(route_id):
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    if 'photo' not in request.files:
        return api_error('No photo file provided')
    f = request.files['photo']
    if f.content_type not in ALLOWED_PHOTO_TYPES:
        return api_error('Only JPEG, PNG, and WebP images are allowed', 400)

    conn = get_db()
    route = conn.execute('SELECT id, photo FROM routes WHERE id=?', (route_id,)).fetchone()
    if not route:
        conn.close()
        return api_error('Route not found', 404)

    img = Image.open(f.stream)
    img = img.convert('RGB')
    img.thumbnail((1920, 1920), Image.LANCZOS)
    out_path = PHOTO_FOLDER / f'{route_id}.jpg'
    img.save(out_path, 'JPEG', quality=85)

    old_photo = route['photo']
    conn.execute('UPDATE routes SET photo=? WHERE id=?', (f'{route_id}.jpg', route_id))
    if old_photo != f'{route_id}.jpg':
        log_change(conn, 'routes', route_id, 'update', user['id'], 'photo', old_photo or 'none', f'{route_id}.jpg')
    conn.commit()
    conn.close()
    return ok(photo=f'{route_id}.jpg'), 201

@app.route('/api/routes/<int:route_id>/photo', methods=['GET'])
def get_route_photo(route_id):
    conn = get_db()
    route = conn.execute('SELECT photo FROM routes WHERE id=?', (route_id,)).fetchone()
    conn.close()
    if not route or not route['photo']:
        return api_error('No photo for this route', 404)
    path = PHOTO_FOLDER / route['photo']
    if not path.exists():
        return api_error('Photo file not found', 404)
    return send_file(path, mimetype='image/jpeg')

@app.route('/api/routes/<int:route_id>/photo', methods=['DELETE'])
@jwt_required()
def delete_route_photo(route_id):
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    conn = get_db()
    route = conn.execute('SELECT photo FROM routes WHERE id=?', (route_id,)).fetchone()
    if not route or not route['photo']:
        conn.close()
        return api_error('No photo for this route', 404)
    path = PHOTO_FOLDER / route['photo']
    if path.exists():
        path.unlink()
    log_change(conn, 'routes', route_id, 'update', user['id'], 'photo', route['photo'], 'none')
    conn.execute('UPDATE routes SET photo=NULL WHERE id=?', (route_id,))
    conn.commit()
    conn.close()
    return ok(deleted=True)

# ── ATTEMPTS ─────────────────────────────────────────────────────────────────
@app.route('/api/routes/<int:route_id>/add_attempt', methods=['GET'])
@jwt_required()
def add_attempt(route_id):
    user_id = int(get_jwt_identity())
    conn = get_db()
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    if not attempt:
        cur = conn.execute('INSERT INTO attempts (user_id, route_id, amount) VALUES (?,?,1)', (user_id, route_id))
        log_change(conn, 'attempts', cur.lastrowid, 'insert', user_id, summary=f'Started attempts on route {route_id}')
    else:
        conn.execute('UPDATE attempts SET amount=amount+1 WHERE user_id=? AND route_id=?', (user_id, route_id))
        log_change(conn, 'attempts', attempt['id'], 'update', user_id, 'amount', str(attempt['amount']), str(attempt['amount'] + 1))
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    conn.commit()
    conn.close()
    return ok(attempt=dict(attempt))


@app.route('/api/routes/<int:route_id>/remove_attempt', methods=['GET'])
@jwt_required()
def remove_attempt(route_id):
    user_id = int(get_jwt_identity())
    conn = get_db()
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    if attempt and attempt['amount'] > 0:
        conn.execute('UPDATE attempts SET amount=amount-1 WHERE user_id=? AND route_id=? AND amount>0', (user_id, route_id))
        log_change(conn, 'attempts', attempt['id'], 'update', user_id, 'amount', str(attempt['amount']), str(attempt['amount'] - 1))
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    conn.commit()
    conn.close()
    return ok(attempt=dict(attempt) if attempt else None)

@app.route('/api/routes/<int:route_id>/sent_attempt', methods=['GET'])
@jwt_required()
def sent_attempt(route_id):
    user_id = int(get_jwt_identity())
    conn = get_db()
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    if not attempt:
        cur = conn.execute('INSERT INTO attempts (user_id, route_id, amount, sent, sent_at) VALUES (?,?,1,1,CURRENT_TIMESTAMP)', (user_id, route_id))
        log_change(conn, 'attempts', cur.lastrowid, 'insert', user_id, summary=f'Sent route {route_id} (first attempt)')
    else:
        if not attempt['sent']:
            log_change(conn, 'attempts', attempt['id'], 'update', user_id, 'amount', str(attempt['amount']), str(attempt['amount'] + 1))
            log_change(conn, 'attempts', attempt['id'], 'update', user_id, 'sent', '0', '1')
            conn.execute('UPDATE attempts SET amount=amount+1 WHERE user_id=? AND route_id=?', (user_id, route_id))
            conn.execute('UPDATE attempts SET sent=1 WHERE user_id=? AND route_id=?', (user_id, route_id))
            conn.execute('UPDATE attempts SET sent_at=CURRENT_TIMESTAMP WHERE user_id=? AND route_id=?', (user_id, route_id))
    # If this route was a project, mark it sent too
    conn.execute('UPDATE projects SET sent=1 WHERE user_id=? AND route_id=?', (user_id, route_id))

    # Check for route-relevant tag categories that have never been used on any route
    empty_categories = [
        r['category'] for r in conn.execute('''
            SELECT t.category FROM tags t
            LEFT JOIN tag_routes tr ON tr.tag_id = t.id
            WHERE t.category NOT IN ('other', 'approach', 'exposure')
            GROUP BY t.category
            HAVING COUNT(tr.id) = 0
        ''').fetchall()
    ]

    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    conn.commit()
    conn.close()
    return ok(attempt=dict(attempt), empty_categories=empty_categories)

@app.route('/api/routes/<int:route_id>/unsent_attempt', methods=['GET'])
@jwt_required()
def unsent_attempt(route_id):
    user_id = int(get_jwt_identity())
    conn = get_db()
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    if attempt and attempt['sent']:
        log_change(conn, 'attempts', attempt['id'], 'update', user_id, 'sent', '1', '0')
        conn.execute('UPDATE attempts SET sent=0, sent_at=NULL WHERE user_id=? AND route_id=?', (user_id, route_id))
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    conn.commit()
    conn.close()
    return ok(attempt=dict(attempt) if attempt else None)

# ── COMMENTS ─────────────────────────────────────────────────────────────────
@app.route('/api/routes/<int:route_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(route_id):
    conn = get_db()
    rows = conn.execute('''SELECT c.*, u.username FROM comments c JOIN users u ON u.id=c.user_id WHERE c.route_id=? ORDER BY c.created_at DESC''', (route_id,)).fetchall()
    conn.close(); return ok([dict(r) for r in rows])

@app.route('/api/routes/<int:route_id>/comments', methods=['POST'])
@jwt_required()
def upsert_comment(route_id):
    uid = int(get_jwt_identity())
    d   = request.get_json() or {}
    stars           = max(0.0, min(5.0, float(d.get('stars', 0))))
    perceived_grade = (d.get('perceived_grade') or '').strip()
    body            = (d.get('body') or '').strip()
    beta            = (d.get('beta') or '').strip()
    conn = get_db()
    existing = conn.execute('SELECT * FROM comments WHERE user_id=? AND route_id=?', (uid, route_id)).fetchone()
    if existing:
        if stars != existing['stars']:
            log_change(conn, 'comments', existing['id'], 'update', uid, 'stars', str(existing['stars']), str(stars))
        if perceived_grade != existing['perceived_grade']:
            log_change(conn, 'comments', existing['id'], 'update', uid, 'perceived_grade', existing['perceived_grade'], perceived_grade)
        if body != existing['body']:
            log_change(conn, 'comments', existing['id'], 'update', uid, 'body', existing['body'], body)
        if beta != existing['beta']:
            log_change(conn, 'comments', existing['id'], 'update', uid, 'beta', existing['beta'], beta)
        conn.execute('UPDATE comments SET stars=?, perceived_grade=?, body=?, beta=? WHERE user_id=? AND route_id=?', (stars, perceived_grade, body, beta, uid, route_id))
    else:
        cur = conn.execute('INSERT INTO comments (user_id, route_id, stars, perceived_grade, body, beta) VALUES (?,?,?,?,?,?)', (uid, route_id, stars, perceived_grade, body, beta))
        log_change(conn, 'comments', cur.lastrowid, 'insert', uid, summary=f'Comment on route {route_id}')
    conn.commit()
    c = conn.execute('SELECT c.*, u.username FROM comments c JOIN users u ON u.id=c.user_id WHERE c.user_id=? AND c.route_id=?', (uid, route_id)).fetchone()
    conn.close(); return ok(dict(c))

@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    uid = int(get_jwt_identity())
    user = get_current_user()
    conn = get_db()
    comment = conn.execute('SELECT * FROM comments WHERE id=?', (comment_id,)).fetchone()
    if not comment: conn.close(); return api_error('Not found', 404)
    if comment['user_id'] != uid and not user['is_admin']: conn.close(); return api_error('Forbidden', 403)
    log_change(conn, 'comments', comment_id, 'delete', uid, 'body', comment['body'], summary=f'Deleted comment on route {comment["route_id"]}')
    conn.execute('DELETE FROM comments WHERE id=?', (comment_id,))
    conn.commit(); conn.close()
    return ok(deleted=True)

# ── SEARCH ────────────────────────────────────────────────────────────────────
@app.route('/api/search', methods=['GET'])
@jwt_required()
def search():
    q               = (request.args.get('q') or '').strip()
    tag_ids         = request.args.getlist('tag_ids')
    projects_only   = request.args.get('projects_only')
    grade_min_sort  = request.args.get('grade_min_sort', type=int)
    grade_max_sort  = request.args.get('grade_max_sort', type=int)

    conn = get_db()

    # Separate topo-level tags (approach/exposure) from route-level tags
    topo_level_categories = ('approach', 'exposure')
    topo_tag_ids = []
    route_tag_ids = []
    if tag_ids:
        tag_rows = conn.execute(
            f'SELECT id, category FROM tags WHERE id IN ({",".join("?" * len(tag_ids))})',
            tag_ids
        ).fetchall()
        tag_id_to_cat = {t['id']: t['category'] for t in tag_rows}
        for tid in tag_ids:
            tid_int = int(tid)
            cat = tag_id_to_cat.get(tid_int)
            if cat in topo_level_categories:
                topo_tag_ids.append(tid_int)
            else:
                route_tag_ids.append(tid_int)

    # ── Build route query ──
    route_conditions = []
    route_params = []

    # Only route-level tags filter routes (approach/exposure are topo-level, in tag_topos)
    if route_tag_ids:
        placeholders = ','.join('?' * len(route_tag_ids))
        route_conditions.append(f'r.id IN (SELECT route_id FROM tag_routes WHERE tag_id IN ({placeholders}))')
        route_params.extend(route_tag_ids)

    if grade_min_sort is not None:
        route_conditions.append('r.sorting_grade >= ?')
        route_params.append(grade_min_sort)

    if grade_max_sort is not None:
        route_conditions.append('r.sorting_grade <= ?')
        route_params.append(grade_max_sort)

    if route_conditions:
        where = ' WHERE ' + ' AND '.join(route_conditions)
        route_rows = conn.execute(f'SELECT DISTINCT r.* FROM routes r{where}', route_params).fetchall()
    else:
        route_rows = conn.execute('SELECT * FROM routes').fetchall()

    if projects_only:
        project_route_ids = set(
            r['route_id'] for r in conn.execute(
                'SELECT route_id FROM projects WHERE user_id=?', (int(get_jwt_identity()),)
            ).fetchall()
        )
        route_rows = [r for r in route_rows if r['id'] in project_route_ids]

    # ── Build topo query ──
    topo_conditions = []
    topo_params = []

    if topo_tag_ids:
        placeholders = ','.join('?' * len(topo_tag_ids))
        # Check both tag_topos (new) and cascaded tag_routes (legacy) for backward compat
        topo_conditions.append(
            f't.id IN (SELECT topo_id FROM tag_topos WHERE tag_id IN ({placeholders})'
            f' UNION '
            f'SELECT r.topo_id FROM routes r JOIN tag_routes tr ON tr.route_id=r.id WHERE tr.tag_id IN ({placeholders}))'
        )
        topo_params.extend(topo_tag_ids)
        topo_params.extend(topo_tag_ids)

    if topo_conditions:
        topo_where = ' WHERE ' + ' AND '.join(topo_conditions)
        topo_rows = conn.execute(f'SELECT DISTINCT t.* FROM topos t{topo_where}', topo_params).fetchall()
    else:
        topo_rows = conn.execute('SELECT * FROM topos').fetchall()
    conn.close()

    route_by_name = {r['name']: dict(r) for r in route_rows}
    topo_by_title = {t['title']: dict(t) for t in topo_rows}

    if q:
        matched_routes = fuzzy_search(q, list(route_by_name.keys()))[:20]
        matched_topos  = fuzzy_search(q, list(topo_by_title.keys()))[:20]
        routes = [dict(route_by_name[n], match_pos=p) for n, p in matched_routes if n in route_by_name]
        topos  = [dict(topo_by_title[t], match_pos=p) for t, p in matched_topos  if t in topo_by_title]
    else:
        # When only topo-level tags (approach/exposure) are active, hide routes
        if topo_tag_ids and not route_tag_ids and grade_min_sort is None and grade_max_sort is None and not projects_only:
            routes = []
        else:
            routes = list(route_by_name.values())[:40]
        topos  = list(topo_by_title.values())[:40] if topo_tag_ids else []

    return ok(routes=routes, topos=topos)

# ── TAGS ──────────────────────────────────────────────────────────────────────

@app.route('/api/tags', methods=['GET'])
@jwt_required()
def list_tags():
    """Return all tags, optionally filtered by category, each with route and topo counts."""
    category = request.args.get('category')
    conn = get_db()
    if category:
        tags = conn.execute('''
            SELECT t.id, t.name, t.name_fr, t.category,
                   COUNT(DISTINCT tr.route_id) as route_count,
                   COUNT(DISTINCT tt.topo_id) as topo_count
            FROM tags t
            LEFT JOIN tag_routes tr ON tr.tag_id = t.id
            LEFT JOIN tag_topos tt ON tt.tag_id = t.id
            WHERE t.category=?
            GROUP BY t.id
            ORDER BY t.name
        ''', (category,)).fetchall()
    else:
        tags = conn.execute('''
            SELECT t.id, t.name, t.name_fr, t.category,
                   COUNT(DISTINCT tr.route_id) as route_count,
                   COUNT(DISTINCT tt.topo_id) as topo_count
            FROM tags t
            LEFT JOIN tag_routes tr ON tr.tag_id = t.id
            LEFT JOIN tag_topos tt ON tt.tag_id = t.id
            GROUP BY t.id
            ORDER BY t.category, t.name
        ''').fetchall()
    conn.close()
    return ok(tags=[dict(t) for t in tags])

@app.route('/api/routes/<int:route_id>/tags', methods=['POST'])
@jwt_required()
def assign_tag(route_id):
    """Assign an existing tag to a route."""
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    tag_id = d.get('tag_id')
    if not tag_id: return api_error('tag_id required')
    conn = get_db()
    # Verify route exists
    if not conn.execute('SELECT id FROM routes WHERE id=?', (route_id,)).fetchone():
        conn.close(); return api_error('Route not found', 404)
    # Verify tag exists
    if not conn.execute('SELECT id FROM tags WHERE id=?', (tag_id,)).fetchone():
        conn.close(); return api_error('Tag not found', 404)
    # Upsert (ignore if already assigned)
    tag = conn.execute('SELECT name FROM tags WHERE id=?', (tag_id,)).fetchone()
    tag_name = tag['name'] if tag else 'unknown'
    conn.execute(
        'INSERT OR IGNORE INTO tag_routes (route_id, tag_id) VALUES (?,?)',
        (route_id, tag_id)
    )
    log_change(conn, 'tag_routes', 0, 'insert', user['id'], summary=f'Assigned tag "{tag_name}" to route {route_id}')
    conn.commit()
    tags = conn.execute(
        'SELECT t.id, t.name, t.name_fr, t.category FROM tag_routes tr JOIN tags t ON tr.tag_id=t.id WHERE tr.route_id=?',
        (route_id,)
    ).fetchall()
    conn.close()
    return ok(tags=[dict(t) for t in tags])

@app.route('/api/routes/<int:route_id>/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def unassign_tag(route_id, tag_id):
    """Remove a tag from a route."""
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    conn = get_db()
    tag = conn.execute('SELECT name FROM tags WHERE id=?', (tag_id,)).fetchone()
    tag_name = tag['name'] if tag else 'unknown'
    conn.execute(
        'DELETE FROM tag_routes WHERE route_id=? AND tag_id=?',
        (route_id, tag_id)
    )
    log_change(conn, 'tag_routes', 0, 'delete', user['id'], summary=f'Removed tag "{tag_name}" from route {route_id}')
    conn.commit()
    tags = conn.execute(
        'SELECT t.id, t.name, t.name_fr, t.category FROM tag_routes tr JOIN tags t ON tr.tag_id=t.id WHERE tr.route_id=?',
        (route_id,)
    ).fetchall()
    conn.close()
    return ok(tags=[dict(t) for t in tags])

@app.route('/api/topos/<int:topo_id>/tags', methods=['GET'])
@jwt_required()
def list_topo_tags(topo_id):
    """Return all tags assigned to a topo."""
    conn = get_db()
    tags = conn.execute(
        'SELECT t.id, t.name, t.name_fr, t.category FROM tag_topos tt JOIN tags t ON tt.tag_id=t.id WHERE tt.topo_id=?',
        (topo_id,)
    ).fetchall()
    conn.close()
    return ok(tags=[dict(t) for t in tags])

@app.route('/api/topos/<int:topo_id>/tags', methods=['POST'])
@jwt_required()
def assign_topo_tag(topo_id):
    """Assign an existing tag to a topo."""
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    tag_id = d.get('tag_id')
    if not tag_id: return api_error('tag_id required')
    conn = get_db()
    if not conn.execute('SELECT id FROM topos WHERE id=?', (topo_id,)).fetchone():
        conn.close(); return api_error('Topo not found', 404)
    if not conn.execute('SELECT id FROM tags WHERE id=?', (tag_id,)).fetchone():
        conn.close(); return api_error('Tag not found', 404)
    tag = conn.execute('SELECT name FROM tags WHERE id=?', (tag_id,)).fetchone()
    tag_name = tag['name'] if tag else 'unknown'
    conn.execute(
        'INSERT OR IGNORE INTO tag_topos (topo_id, tag_id) VALUES (?,?)',
        (topo_id, tag_id)
    )
    log_change(conn, 'tag_topos', 0, 'insert', user['id'], summary=f'Assigned tag "{tag_name}" to topo {topo_id}')
    conn.commit()
    tags = conn.execute(
        'SELECT t.id, t.name, t.name_fr, t.category FROM tag_topos tt JOIN tags t ON tt.tag_id=t.id WHERE tt.topo_id=?',
        (topo_id,)
    ).fetchall()
    conn.close()
    return ok(tags=[dict(t) for t in tags])

@app.route('/api/topos/<int:topo_id>/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def unassign_topo_tag(topo_id, tag_id):
    """Remove a tag from a topo."""
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    conn = get_db()
    tag = conn.execute('SELECT name FROM tags WHERE id=?', (tag_id,)).fetchone()
    tag_name = tag['name'] if tag else 'unknown'
    conn.execute(
        'DELETE FROM tag_topos WHERE topo_id=? AND tag_id=?',
        (topo_id, tag_id)
    )
    log_change(conn, 'tag_topos', 0, 'delete', user['id'], summary=f'Removed tag "{tag_name}" from topo {topo_id}')
    conn.commit()
    tags = conn.execute(
        'SELECT t.id, t.name, t.name_fr, t.category FROM tag_topos tt JOIN tags t ON tt.tag_id=t.id WHERE tt.topo_id=?',
        (topo_id,)
    ).fetchall()
    conn.close()
    return ok(tags=[dict(t) for t in tags])

# ── PROJECTS ────────────────────────────────────────────────────────────────────
@app.route('/api/routes/<int:route_id>/project', methods=['POST'])
@jwt_required()
def toggle_project(route_id):
    user_id = int(get_jwt_identity())
    conn = get_db()
    existing = conn.execute('SELECT id FROM projects WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    if existing:
        log_change(conn, 'projects', existing['id'], 'delete', user_id, summary=f'Removed route {route_id} from projects')
        conn.execute('DELETE FROM projects WHERE id=?', (existing['id'],))
        is_project = False
    else:
        conn.execute('INSERT INTO projects (user_id, route_id) VALUES (?,?)', (user_id, route_id))
        log_change(conn, 'projects', 0, 'insert', user_id, summary=f'Added route {route_id} to projects')
        is_project = True
    conn.commit()
    conn.close()
    return ok(is_project=is_project)

@app.route('/api/projects', methods=['GET'])
@jwt_required()
def list_projects():
    user_id = int(get_jwt_identity())
    conn = get_db()
    rows = conn.execute('''
        SELECT p.id as project_id, p.created_at as project_created_at, p.sent as project_sent,
               r.id as route_id, r.name as route_name, r.grade, r.sorting_grade, r.length, r.route_index,
               t.id as topo_id, t.title as topo_title
        FROM projects p
        JOIN routes r ON r.id = p.route_id
        JOIN topos t ON t.id = r.topo_id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
    ''', (user_id,)).fetchall()
    conn.close()
    return ok(projects=[dict(r) for r in rows])

# ── STATS ──────────────────────────────────────────────────────────────────────
@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    auth_user_id = int(get_jwt_identity())
    conn = get_db()

    target_id = request.args.get('user_id')
    if target_id:
        user_id = int(target_id)
        target_user = conn.execute('SELECT id, username FROM users WHERE id=?', (user_id,)).fetchone()
        if not target_user:
            conn.close()
            return api_error('User not found', 404)
        target_username = target_user['username']
    else:
        user_id = auth_user_id
        target_username = None

    rows = conn.execute('''
        SELECT
            a.route_id,
            a.sent,
            a.amount,
            r.grade,
            r.sorting_grade,
            r.name as route_name,
            t.title as topo_title
        FROM attempts a
        JOIN routes r ON r.id = a.route_id
        JOIN topos t ON t.id = r.topo_id
        WHERE a.user_id = ?
    ''', (user_id,)).fetchall()

    rows = [dict(r) for r in rows]

    sent_rows    = [r for r in rows if r['sent']]
    working_rows = [r for r in rows if not r['sent'] and r['amount'] > 0]

    max_grade = None
    if sent_rows:
        best = max(sent_rows, key=lambda r: r['sorting_grade'])
        max_grade = {'grade': best['grade'], 'sorting_grade': best['sorting_grade']}

    grade_counts = {}
    for r in sent_rows:
        g = r['grade']
        if g not in grade_counts:
            grade_counts[g] = {'grade': g, 'sorting_grade': r['sorting_grade'], 'count': 0}
        grade_counts[g]['count'] += 1
    grade_pyramid = sorted(grade_counts.values(), key=lambda x: x['sorting_grade'])

    grade_avg_attempts = {}
    for r in sent_rows:
        g = r['grade']
        if g not in grade_avg_attempts:
            grade_avg_attempts[g] = {'grade': g, 'sorting_grade': r['sorting_grade'], 'total': 0, 'count': 0}
        grade_avg_attempts[g]['total'] += r['amount']
        grade_avg_attempts[g]['count'] += 1
    avg_attempts = [
        {
            'grade': v['grade'],
            'sorting_grade': v['sorting_grade'],
            'avg': round(v['total'] / v['count'], 2)
        }
        for v in sorted(grade_avg_attempts.values(), key=lambda x: x['sorting_grade'])
    ]

    working = [
        {
            'route_id':   r['route_id'],
            'route_name': r['route_name'],
            'topo_title': r['topo_title'],
            'grade':      r['grade'],
            'sorting_grade': r['sorting_grade'],
            'attempts':   r['amount'],
        }
        for r in sorted(working_rows, key=lambda x: x['sorting_grade'], reverse=True)
    ]

    # ── Tag breakdown: which tags appear on sent routes ──
    tag_rows = conn.execute('''
        SELECT t.category, t.name, t.name_fr, COUNT(*) as count
        FROM attempts a
        JOIN tag_routes tr ON tr.route_id = a.route_id
        JOIN tags t ON t.id = tr.tag_id
        WHERE a.user_id = ? AND a.sent = 1 AND (t.category == 'style' OR t.category == 'route_style' OR t.category == 'hold')
        GROUP BY t.id
        ORDER BY t.category, count DESC
    ''', (user_id,)).fetchall()
    tag_breakdown = [dict(r) for r in tag_rows]

    # ── Flash rate by grade ──
    flash_rows = conn.execute('''
        SELECT
            r.grade,
            r.sorting_grade,
            COUNT(*) as total,
            SUM(CASE WHEN a.amount = 1 THEN 1 ELSE 0 END) as flash_count,
            SUM(CASE WHEN a.amount > 1 THEN 1 ELSE 0 END) as non_flash_count
        FROM attempts a
        JOIN routes r ON r.id = a.route_id
        WHERE a.user_id = ? AND a.sent = 1
        GROUP BY r.grade
        ORDER BY r.sorting_grade
    ''', (user_id,)).fetchall()
    flash_by_grade = []
    for r in flash_rows:
        d = dict(r)
        d['flash_rate'] = round(d['flash_count'] / d['total'], 2) if d['total'] > 0 else 0
        flash_by_grade.append(d)

    conn.close()
    return ok(
        max_grade=max_grade,
        grade_pyramid=grade_pyramid,
        avg_attempts_per_grade=avg_attempts,
        working=working,
        tag_breakdown=tag_breakdown,
        flash_by_grade=flash_by_grade,
        summary={
            'total_sent':     len(sent_rows),
            'total_attempts': sum(r['amount'] for r in rows),
            'total_working':  len(working_rows),
        },
        username=target_username,
    )

# ── NOTIFICATIONS ────────────────────────────────────────────────────────────
@app.route('/api/notifications', methods=['POST'])
@jwt_required()
def submit_notification():
    user = require_user()
    d = request.get_json() or {}
    body = (d.get('body') or '').strip()
    category = (d.get('category') or 'other').strip()
    valid_categories = ('bug', 'misspelling', 'suggestion', 'feature', 'other')
    if not body:
        return api_error('Body is required')
    if category not in valid_categories:
        return api_error(f'Invalid category. Must be one of: {",".join(valid_categories)}')

    conn = get_db()
    row = conn.execute(
        'SELECT id FROM notifications WHERE user_id=? AND created_at > datetime("now", "-1 day")',
        (user['id'],)
    ).fetchone()
    if row:
        conn.close()
        return api_error('You can only submit one notification per day', 429)

    cur = conn.execute(
        'INSERT INTO notifications (user_id, body, category) VALUES (?,?,?)',
        (user['id'], body, category)
    )
    log_change(conn, 'notifications', cur.lastrowid, 'insert', user['id'], summary=f'Notification ({category}): {body[:80]}')
    conn.commit()
    conn.close()
    return ok(submitted=True), 201


# ── ADMIN: NOTIFICATIONS ────────────────────────────────────────────────────
@app.route('/api/admin/notifications', methods=['GET'])
@jwt_required()
def list_notifications():
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)

    conn = get_db()
    reports = conn.execute('''
        SELECT o.*, u.username as submitter_name
        FROM oops_reports o
        LEFT JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
    ''').fetchall()
    notifs = conn.execute('''
        SELECT n.*, u.username as submitter_name
        FROM notifications n
        LEFT JOIN users u ON u.id = n.user_id
        ORDER BY n.created_at DESC
    ''').fetchall()
    conn.close()

    items = []
    for r in reports:
        d = dict(r)
        d['type'] = 'report'
        items.append(d)
    for r in notifs:
        d = dict(r)
        d['type'] = 'notification'
        items.append(d)

    items.sort(key=lambda x: x['created_at'], reverse=True)
    return ok(items=items)

@app.route('/api/admin/notifications/<string:ntype>/<int:nid>/resolve', methods=['PATCH'])
@jwt_required()
def resolve_notification(ntype, nid):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)

    table = {'report': 'oops_reports', 'notification': 'notifications'}.get(ntype)
    if not table:
        return api_error('Invalid notification type', 400)

    conn = get_db()
    conn.execute(f'UPDATE {table} SET resolved=1 WHERE id=?', (nid,))
    log_change(conn, table, nid, 'update', int(get_jwt_identity()), 'resolved', '0', '1')
    conn.commit()
    conn.close()
    return ok(resolved=True)

@app.route('/api/admin/notifications/<string:ntype>/<int:nid>', methods=['DELETE'])
@jwt_required()
def delete_notification(ntype, nid):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)

    table = {'report': 'oops_reports', 'notification': 'notifications'}.get(ntype)
    if not table:
        return api_error('Invalid notification type', 400)

    conn = get_db()
    row = conn.execute(f'SELECT * FROM {table} WHERE id=?', (nid,)).fetchone()
    if table == 'oops_reports':
        summary_text = f'Deleted report #{nid}: {(row["explanation"][:80] if row else "?")}'
    else:
        summary_text = f'Deleted notification #{nid}: {(row["body"][:80] if row else "?")}'
    conn.execute(f'DELETE FROM {table} WHERE id=?', (nid,))
    log_change(conn, table, nid, 'delete', int(get_jwt_identity()), summary=summary_text)
    conn.commit()
    conn.close()
    return ok(deleted=True)


# ── COMING SOON ─────────────────────────────────────────────────────────────────
@app.route('/api/coming-soon', methods=['GET'])
@jwt_required()
def list_coming_soon():
    user = get_current_user()
    conn = get_db()
    rows = conn.execute('''
        SELECT cs.*, u.username AS created_by_username,
               COALESCE(up.upvotes, 0) AS upvotes,
               COALESCE(down.downvotes, 0) AS downvotes,
               csv.vote AS my_vote
        FROM coming_soon cs
        LEFT JOIN users u ON cs.created_by = u.id
        LEFT JOIN (SELECT feature_id, COUNT(*) AS upvotes FROM coming_soon_votes WHERE vote=1 GROUP BY feature_id) up ON up.feature_id = cs.id
        LEFT JOIN (SELECT feature_id, COUNT(*) AS downvotes FROM coming_soon_votes WHERE vote=-1 GROUP BY feature_id) down ON down.feature_id = cs.id
        LEFT JOIN coming_soon_votes csv ON csv.feature_id = cs.id AND csv.user_id=?
        ORDER BY cs.created_at DESC
    ''', (user['id'],)).fetchall()
    conn.close()
    return ok(items=[dict(r) for r in rows])

@app.route('/api/coming-soon', methods=['POST'])
@jwt_required()
def create_coming_soon():
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    d = request.get_json() or {}
    title = (d.get('title') or '').strip()
    description = (d.get('description') or '').strip()
    if not title:
        return api_error('Title is required', 400)
    user = get_current_user()
    conn = get_db()
    cur = conn.execute('INSERT INTO coming_soon (title, description, created_by) VALUES (?,?,?)',
                       (title, description, user['id']))
    log_change(conn, 'coming_soon', cur.lastrowid, 'insert', user['id'], summary=f'Created feature request "{title}"')
    conn.commit()
    row = conn.execute('''
        SELECT cs.*, u.username AS created_by_username,
               0 AS upvotes, 0 AS downvotes, NULL AS my_vote
        FROM coming_soon cs
        LEFT JOIN users u ON cs.created_by = u.id
        WHERE cs.id=?
    ''', (cur.lastrowid,)).fetchone()
    conn.close()
    return ok(dict(row))

@app.route('/api/coming-soon/<int:fid>/vote', methods=['POST'])
@jwt_required()
def vote_coming_soon(fid):
    user = get_current_user()
    d = request.get_json() or {}
    vote = d.get('vote')
    if vote not in (1, -1, 0):
        return api_error('Vote must be 1, -1, or 0', 400)
    conn = get_db()
    existing = conn.execute('SELECT id, vote FROM coming_soon_votes WHERE feature_id=? AND user_id=?', (fid, user['id'])).fetchone()
    if vote == 0:
        if existing:
            log_change(conn, 'coming_soon_votes', existing['id'], 'delete', user['id'], summary=f'Removed vote on feature {fid}')
            conn.execute('DELETE FROM coming_soon_votes WHERE id=?', (existing['id'],))
        conn.commit()
        conn.close()
        return ok(vote=0)
    if existing:
        if existing['vote'] == vote:
            conn.close()
            return ok(vote=vote)
        log_change(conn, 'coming_soon_votes', existing['id'], 'update', user['id'], 'vote', str(existing['vote']), str(vote))
        conn.execute('UPDATE coming_soon_votes SET vote=? WHERE id=?', (vote, existing['id']))
    else:
        conn.execute('INSERT INTO coming_soon_votes (feature_id, user_id, vote) VALUES (?,?,?)', (fid, user['id'], vote))
        log_change(conn, 'coming_soon_votes', 0, 'insert', user['id'], summary=f'Voted {vote} on feature {fid}')
    conn.commit()
    conn.close()
    return ok(vote=vote)

@app.route('/api/coming-soon/<int:fid>', methods=['DELETE'])
@jwt_required()
def delete_coming_soon(fid):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    conn = get_db()
    row = conn.execute('SELECT title FROM coming_soon WHERE id=?', (fid,)).fetchone()
    title = row['title'] if row else 'unknown'
    conn.execute('DELETE FROM coming_soon WHERE id=?', (fid,))
    log_change(conn, 'coming_soon', fid, 'delete', int(get_jwt_identity()), summary=f'Deleted feature request "{title}"')
    conn.commit()
    conn.close()
    return ok(deleted=True)

# ── AUDIT LOG ──────────────────────────────────────────────────────────────────
@app.route('/api/admin/audit-log', methods=['GET'])
@jwt_required()
def get_audit_log():
    user = require_user()
    conn = get_db()
    if user['is_admin']:
        rows = conn.execute('''
            SELECT al.*, u.username
            FROM audit_log al
            LEFT JOIN users u ON u.id = al.user_id
            ORDER BY al.timestamp DESC
            LIMIT 200
        ''').fetchall()
    else:
        rows = conn.execute('''
            SELECT al.*, u.username
            FROM audit_log al
            LEFT JOIN users u ON u.id = al.user_id
            WHERE al.user_id = ?
            ORDER BY al.timestamp DESC
            LIMIT 200
        ''', (user['id'],)).fetchall()
    conn.close()
    return ok(logs=[dict(r) for r in rows])

# ── CONTRIBUTIONS ─────────────────────────────────────────────────────────────
@app.route('/api/home', methods=['GET'])
@jwt_required()
def home():
    conn = get_db()
    topo_count  = conn.execute('SELECT COUNT(*) FROM topos').fetchone()[0]
    route_count = conn.execute('SELECT COUNT(*) FROM routes').fetchone()[0]
    user_count  = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]

    # Topo completion: 0.25 each for approach tag, exposure tag, parking location, routes location
    topo_score = conn.execute('''
        SELECT COALESCE(SUM(
            CASE WHEN EXISTS (SELECT 1 FROM tag_topos tt JOIN tags tg ON tt.tag_id = tg.id WHERE tt.topo_id = t.id AND tg.category = 'approach') THEN 0.25 ELSE 0 END +
            CASE WHEN EXISTS (SELECT 1 FROM tag_topos tt JOIN tags tg ON tt.tag_id = tg.id WHERE tt.topo_id = t.id AND tg.category = 'exposure') THEN 0.25 ELSE 0 END +
            CASE WHEN t.parking_lat IS NOT NULL AND t.parking_lon IS NOT NULL THEN 0.25 ELSE 0 END +
            CASE WHEN t.routes_lat IS NOT NULL AND t.routes_lon IS NOT NULL THEN 0.25 ELSE 0 END
        ), 0) FROM topos t
    ''').fetchone()[0]

    # Route completion: 0.25 each for photo, route_style tag, hold tag, style tag
    route_score = conn.execute('''
        SELECT COALESCE(SUM(
            CASE WHEN r.photo IS NOT NULL THEN 0.25 ELSE 0 END +
            CASE WHEN EXISTS (SELECT 1 FROM tag_routes tr JOIN tags tg ON tr.tag_id = tg.id WHERE tr.route_id = r.id AND tg.category = 'route_style') THEN 0.25 ELSE 0 END +
            CASE WHEN EXISTS (SELECT 1 FROM tag_routes tr JOIN tags tg ON tr.tag_id = tg.id WHERE tr.route_id = r.id AND tg.category = 'hold') THEN 0.25 ELSE 0 END +
            CASE WHEN EXISTS (SELECT 1 FROM tag_routes tr JOIN tags tg ON tr.tag_id = tg.id WHERE tr.route_id = r.id AND tg.category = 'style') THEN 0.25 ELSE 0 END
        ), 0) FROM routes r
    ''').fetchone()[0]

    topo_pct = round(topo_score / topo_count * 100, 2) if topo_count > 0 else 0.0
    route_pct = round(route_score / route_count * 100, 2) if route_count > 0 else 0.0

    recent = conn.execute('''
        SELECT t.id, t.title,
               (SELECT COUNT(*) FROM routes r WHERE r.topo_id = t.id) AS route_count
        FROM topos t ORDER BY t.id DESC LIMIT 6
    ''').fetchall()
    conn.close()
    return ok(topo_count=topo_count, route_count=route_count,
              user_count=user_count,
              topo_score=topo_score,
              route_score=route_score,
              topo_pct=topo_pct,
              route_pct=route_pct,
              recent_topos=[dict(r) for r in recent])

@app.route('/api/contributions', methods=['GET'])
@jwt_required()
def get_contributions():
    conn = get_db()
    rows = conn.execute('''
        SELECT
          scored.user_id,
          u.username,
          SUM(scored.score) AS score,
          COUNT(*) AS actions
        FROM (
          SELECT DISTINCT
            al.user_id,
            al.table_name,
            al.row_id,
            COALESCE(al.field_name, '') AS field_name_eff,
            CASE
              WHEN al.table_name = 'topos' AND al.action = 'insert' THEN 10
              WHEN al.table_name = 'routes' AND al.action = 'insert' THEN 3
              WHEN al.table_name = 'routes' AND al.action = 'update' AND al.field_name IN ('name','grade','length','route_index') THEN 2
              WHEN al.table_name = 'routes' AND al.action = 'update' AND al.field_name = 'photo' THEN 2
              WHEN al.table_name = 'topos' AND al.action = 'update' AND al.field_name IN ('parking_location','routes_location') THEN 3
              WHEN al.table_name = 'topos' AND al.action = 'update' AND al.field_name = 'title' THEN 2
              WHEN al.table_name IN ('tag_routes','tag_topos') AND al.action IN ('insert','delete') THEN 1
              WHEN al.table_name = 'comments' AND al.action = 'insert' THEN 2
              WHEN al.table_name = 'comments' AND al.action = 'update' THEN 1
              ELSE 0
            END AS score
          FROM audit_log al
        ) scored
        JOIN users u ON u.id = scored.user_id
        WHERE scored.score > 0
        GROUP BY scored.user_id
        ORDER BY score DESC
        LIMIT 50
    ''').fetchall()
    conn.close()
    return ok(contributions=[dict(r) for r in rows])

RESTORE_ALLOWED_TABLES = {'topos', 'routes', 'attempts', 'comments', 'projects', 'tag_routes', 'tag_topos', 'coming_soon', 'coming_soon_votes', 'notifications'}

@app.route('/api/admin/audit-log/<int:log_id>/restore', methods=['POST'])
@jwt_required()
def restore_audit_log(log_id):
    user = require_user()
    is_admin = user['is_admin']

    conn = get_db()
    entry = conn.execute('SELECT * FROM audit_log WHERE id=?', (log_id,)).fetchone()
    if not entry:
        conn.close(); return api_error('Log entry not found', 404)

    uid = int(get_jwt_identity())
    if not is_admin and entry['user_id'] != uid:
        conn.close(); return api_error('You can only restore your own changes', 403)
    table = entry['table_name']

    if table not in RESTORE_ALLOWED_TABLES:
        conn.close(); return api_error('Restore not supported for this table', 400)

    if entry['action'] == 'update':
        row_id = entry['row_id']
        field = entry['field_name']
        old_val = entry['old_value']
        new_val = entry['new_value']
        if not field or not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', field):
            conn.close(); return api_error('Invalid field name', 400)
        row = conn.execute(f'SELECT id FROM {table} WHERE id=?', (row_id,)).fetchone()
        if not row:
            conn.close(); return api_error('Target row no longer exists', 404)
        conn.execute(f'UPDATE {table} SET "{field}"=? WHERE id=?', (old_val, row_id))
        conn.execute('DELETE FROM audit_log WHERE id=?', (log_id,))
        log_change(conn, table, row_id, 'update', uid, field, new_val, old_val, f'Restored via audit #{log_id}')
        conn.commit(); conn.close()
        return ok(restored=True, message=f'Restored {table}.{field} from "{new_val}" to "{old_val}"')

    if entry['action'] == 'delete':
        summary = entry['summary'] or ''

        if table in ('tag_routes', 'tag_topos'):
            parent = 'route' if table == 'tag_routes' else 'topo'
            m = re.match(rf'Removed tag "(.+)" from {parent} (\d+)', summary)
            if not m:
                conn.close(); return api_error(f'Cannot parse {table} info from log', 400)
            tag_name = m.group(1)
            parent_id = int(m.group(2))
            tag = conn.execute('SELECT id FROM tags WHERE name=?', (tag_name,)).fetchone()
            if not tag:
                conn.close(); return api_error(f'Tag "{tag_name}" no longer exists', 404)
            parent_row = conn.execute(f'SELECT id FROM {parent}s WHERE id=?', (parent_id,)).fetchone()
            if not parent_row:
                conn.close(); return api_error(f'{parent.capitalize()} #{parent_id} no longer exists', 404)
            if table == 'tag_routes':
                conn.execute('INSERT OR IGNORE INTO tag_routes (route_id, tag_id) VALUES (?,?)', (parent_id, tag['id']))
            else:
                conn.execute('INSERT OR IGNORE INTO tag_topos (topo_id, tag_id) VALUES (?,?)', (parent_id, tag['id']))
            conn.execute('DELETE FROM audit_log WHERE id=?', (log_id,))
            log_change(conn, table, 0, 'insert', uid, summary=f'Restored tag "{tag_name}" on {parent} {parent_id} via audit #{log_id}')
            conn.commit(); conn.close()
            return ok(restored=True, message=f'Restored tag "{tag_name}" on {parent} {parent_id}')

        if table == 'projects':
            m = re.match(r'Removed route (\d+) from projects', summary)
            if not m:
                conn.close(); return api_error('Cannot parse project info from log', 400)
            route_id = int(m.group(1))
            project_uid = entry['user_id']
            route = conn.execute('SELECT id FROM routes WHERE id=?', (route_id,)).fetchone()
            if not route:
                conn.close(); return api_error('Route no longer exists', 404)
            conn.execute('INSERT OR IGNORE INTO projects (user_id, route_id) VALUES (?,?)', (project_uid, route_id))
            conn.execute('DELETE FROM audit_log WHERE id=?', (log_id,))
            log_change(conn, 'projects', 0, 'insert', uid, summary=f'Restored project route {route_id} via audit #{log_id}')
            conn.commit(); conn.close()
            return ok(restored=True, message=f'Restored route {route_id} to projects')

        if table == 'comments':
            row_id = entry['row_id']
            comment_uid = entry['user_id']
            body_text = entry['old_value'] or ''
            m = re.search(r'route (\d+)', summary)
            route_id = int(m.group(1)) if m else None
            if not route_id:
                conn.close(); return api_error('Cannot determine route from log', 400)
            route = conn.execute('SELECT id FROM routes WHERE id=?', (route_id,)).fetchone()
            if not route:
                conn.close(); return api_error('Route no longer exists', 404)
            conn.execute(
                'INSERT OR IGNORE INTO comments (user_id, route_id, body, created_at) VALUES (?,?,?,CURRENT_TIMESTAMP)',
                (comment_uid, route_id, body_text)
            )
            conn.execute('DELETE FROM audit_log WHERE id=?', (log_id,))
            log_change(conn, 'comments', 0, 'insert', uid, summary=f'Restored comment on route {route_id} via audit #{log_id}')
            conn.commit(); conn.close()
            return ok(restored=True, message=f'Restored comment on route {route_id}')

        if table == 'coming_soon':
            m = re.match(r'Deleted feature request "(.+)"', summary)
            title = m.group(1) if m else 'Restored feature'
            conn.execute('INSERT INTO coming_soon (title, description, created_by, created_at) VALUES (?,?,?,CURRENT_TIMESTAMP)',
                         (title, f'Auto-restored from audit log #{log_id}', uid))
            conn.execute('DELETE FROM audit_log WHERE id=?', (log_id,))
            log_change(conn, 'coming_soon', 0, 'insert', uid, summary=f'Restored feature request via audit #{log_id}')
            conn.commit(); conn.close()
            return ok(restored=True, message=f'Restored feature request "{title}"')

        conn.close()
        return api_error('Restore not supported for this type of delete', 400)

    conn.close()
    return api_error('Unknown action type', 400)

if __name__ == '__main__':
    init_db()
    seed.seed()

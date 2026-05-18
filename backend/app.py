import os
import hashlib
from pathlib import Path
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file, send_from_directory, Response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from db import get_db, init_db
from auth import hash_password, check_password, get_current_user, require_user, require_admin
from ocr import extract_text_from_pdf, extract_routes, parse_routes, grade_sort_key, GRADE_PATTERN, FRENCH_ORDER
from bs4 import BeautifulSoup
from thecrag_parser import parse_thecrag_html, fetch_thecrag_html
import re
import seed
from fzf import fuzzy_search

jwt_secret = os.environ.get('JWT_SECRET')
if not jwt_secret:
    raise RuntimeError("JWT_SECRET environment variable is required")

allowed_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = jwt_secret
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config["JWT_BLOCKLIST_ENABLED"] = True
app.config["JWT_BLOCKLIST_TOKEN_CHECKS"] = ["access"]
jwt = JWTManager(app)

limiter = Limiter(app=app, key_func=get_remote_address)

UPLOAD_FOLDER = Path('/app/uploads')
UPLOAD_FOLDER.mkdir(exist_ok=True)

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
@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    d = request.get_json() or {}
    username = (d.get('username') or '').strip()
    password = (d.get('password') or '').strip()
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
    token = create_access_token(identity=str(user['id']), additional_claims={"ver": user['token_version']})
    return ok(token=token, user={'id': user['id'], 'username': user['username'], 'is_admin': bool(user['is_admin'])})

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def me():
    user = get_current_user()
    if not user: return api_error('Not found', 404)
    return ok(user=dict(user))

@app.route('/api/auth/me', methods=['PATCH'])
@jwt_required()
def update_me():
    user = require_user()
    d = request.get_json() or {}
    current_password = (d.get('current_password') or '').strip()
    new_username = (d.get('username') or '').strip()
    new_password = (d.get('password') or '').strip()

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
            'UPDATE users SET username=?, password_hash=?, token_version=token_version+1 WHERE id=?',
            (new_username, hash_password(new_password), user['id'])
        )
    else:
        conn.execute(
            'UPDATE users SET username=? WHERE id=?',
            (new_username, user['id'])
        )

    conn.commit()
    updated = conn.execute('SELECT id, username, is_admin, token_version FROM users WHERE id=?', (user['id'],)).fetchone()
    conn.close()
    new_token = create_access_token(identity=str(updated['id']), additional_claims={"ver": updated['token_version']})
    return ok(user={'id': updated['id'], 'username': updated['username'], 'is_admin': bool(updated['is_admin'])}, token=new_token)

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
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    d = request.get_json() or {}
    username = (d.get('username') or '').strip()
    password = (d.get('password') or '').strip()
    is_admin = bool(d.get('is_admin', False))
    if not username or not password: return api_error('Username and password required')
    conn = get_db()
    try:
        conn.execute('INSERT INTO users (username, password_hash, is_admin) VALUES (?,?,?)', (username, hash_password(password), int(is_admin)))
        conn.commit()
        user = conn.execute('SELECT id, username, is_admin FROM users WHERE username=?', (username,)).fetchone()
        return ok(dict(user)), 201
    except Exception:
        return api_error('Username already taken', 409)
    finally: conn.close()

@app.route('/api/query', methods=['POST'])
@jwt_required()
def query():
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    d = request.get_json() or {}
    sql = (d.get('sql') or '').strip()
    if not sql: return api_error('SQL query required')
    conn = get_db()
    cursor = conn.execute(sql).fetchall()
    if sql.split(' ')[0].lower() in ['update', 'insert', 'delete']:
        conn.commit()
    conn.close()
    return ok(rows=[dict(r) for r in cursor])

@app.route('/api/query/gate', methods=['POST'])
def query_gate():
    d = request.get_json() or {}
    username = (d.get('username') or '').strip()
    password = (d.get('password') or '').strip()
    if not username or not password:
        return api_error('Username and password required')
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE username=?', (username,)).fetchone()
    if not user or not check_password(password, user['password_hash']):
        if user:
            conn.execute('UPDATE users SET banned_until=?, token_version=token_version+1 WHERE id=?', ((datetime.now() + timedelta(days=3)).isoformat(), user['id']))
            conn.commit()
        conn.close()
        return ok(authorized=False, banned=bool(user))
    conn.close()
    return ok(authorized=True, is_admin=bool(user['is_admin']))

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
    conn.close()
    return ok(topo=dict(topo), routes=[dict(r) for r in routes], parking_location=dict(parking_location), routes_location=dict(routes_location))

@app.route('/api/topos/<int:topo_id>/download')
@jwt_required()
def serve_pdf(topo_id):
    conn = get_db()
    row = conn.execute('SELECT filename FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    if not row: return api_error('Not found', 404)
    path = UPLOAD_FOLDER / row['filename']
    mime = 'application/pdf' if path.suffix.lower() == '.pdf' else 'text/html'
    return send_file(path, mimetype=mime, download_name=row['filename'], as_attachment=True)


@app.route('/api/topos/<int:topo_id>/html')
@jwt_required()
def serve_topo_html(topo_id):
    conn = get_db()
    row = conn.execute('SELECT filename FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    if not row: return api_error('Not found', 404)
    path = UPLOAD_FOLDER / row['filename']
    if not path.exists() or path.suffix.lower() != '.html':
        return api_error('HTML file not found', 404)

    with open(path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Strip scripts and all theCrag's own styles
    for tag in soup.find_all('script'):
        tag.decompose()
    for tag in soup.find_all(['link', 'style']):
        tag.decompose()

    # ── Color grades like CragMaster does ──
    GRADE_STOPS = [
        (0,    105, 55, 48),
        (11.5, 88,  60, 46),
        (17.5, 65,  70, 46),
        (19.5, 45,  75, 48),
        (21.5, 30,  78, 46),
        (23.5, 18,  80, 45),
        (25.5, 6,   82, 44),
        (27.5, 352, 80, 42),
        (29.5, 330, 75, 38),
        (35,   285, 70, 32),
    ]

    def grade_to_hsl(grade_key):
        if grade_key < 0:
            return 'hsl(0, 0%, 50%)'
        if grade_key <= GRADE_STOPS[0][0]:
            s = GRADE_STOPS[0]
            return f'hsl({s[1]}, {s[2]}%, {s[3]}%)'
        if grade_key >= GRADE_STOPS[-1][0]:
            s = GRADE_STOPS[-1]
            return f'hsl({s[1]}, {s[2]}%, {s[3]}%)'
        for i in range(len(GRADE_STOPS) - 1):
            lo, hi = GRADE_STOPS[i], GRADE_STOPS[i + 1]
            if grade_key >= lo[0] and grade_key <= hi[0]:
                t = (grade_key - lo[0]) / (hi[0] - lo[0])
                dh = hi[1] - lo[1]
                if dh > 180: dh -= 360
                if dh < -180: dh += 360
                h = lo[1] + dh * t
                s = lo[2] + (hi[2] - lo[2]) * t
                l = lo[3] + (hi[3] - lo[3]) * t
                return f'hsl({h:.1f}, {s:.1f}%, {l:.1f}%)'
        return 'hsl(0, 0%, 50%)'

    for grade_span in soup.find_all('span', class_='r-grade'):
        inner = grade_span.find('span', recursive=False)
        if inner:
            grade_text = inner.get_text(strip=True)
            key = grade_sort_key(grade_text)
            color = grade_to_hsl(key)
            grade_span['style'] = f'color: {color};'
            route_div = grade_span.find_parent('div', class_='route')
            if route_div:
                border = f'3px solid {color}'
                existing = route_div.get('style', '')
                route_div['style'] = f'{existing} border-left: {border}; padding-left: 0.75rem;'

    fragments = ["""<style>
        /* ═══════════════════════════════════════════
           CragMaster — theCrag.com content restyle
           ═══════════════════════════════════════════ */

        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        /* ── Reset & base ── */
        body {
            margin: 0; padding: 0;
            background: #1a1a18;
            color: #f0ede6;
            font-family: 'Barlow', sans-serif;
            font-weight: 300;
            font-size: 15px;
            line-height: 1.5;
            min-height: 100vh;
        }
        #wrapper {
            max-width: 100%;
            padding: 1rem 0;
            margin: 0;
        }
        * { box-sizing: border-box; }

        /* ── Hide chrome ── */
        .bust, .bust__black, .bust__white,
        .regions__navdrawer, .regions__prominent, .regions__aside,
        .regions__stream, .regions__topogroup,
        .sponsor-slot, .sponsor-media-container,
        .regions__subheading, .regions__tools,
        .footer, .region-footer,
        .node-listview__header {
            display: none !important;
        }

        /* ── Main content layout ── */
        .regions__content {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .regions__inner {
            max-width: 100% !important;
            padding: 0 !important;
        }
        .regions__primary {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            float: none !important;
        }

        /* ── Location breadcrumbs ── */
        .regions__heading {
            margin-bottom: 2rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #2a2a26;
        }
        .regions__heading .crumb__long,
        .regions__heading .crumb__short {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #6b6b60;
        }

        /* ── Sector/area headings ── */
        .heading {
            margin: 2.5rem 0 1.5rem;
            position: relative;
        }
        .heading:first-of-type {
            margin-top: 0;
        }
        .heading::after {
            content: '';
            display: block;
            width: 2.5rem;
            height: 3px;
            background: #c8502a;
            margin-top: 0.6rem;
            border-radius: 2px;
        }
        .heading .heading__t {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 2.6rem;
            font-weight: 900;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: #f0ede6;
            margin: 0;
            line-height: 1;
        }
        .headline__byline {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #6b6b60;
            margin-top: 0.3rem;
            display: block;
        }

        /* ── Description text ── */
        .regions__overview {
            padding: 0.25rem 0 0.75rem;
        }
        .regions__overview p,
        .description-container p,
        .description-text {
            color: #c0bdb6;
            font-size: 0.9rem;
            line-height: 1.7;
            margin: 0 0 0.75rem;
        }
        .regions__overview a,
        .description-container a {
            color: #e06540;
            font-weight: 500;
        }
        .regions__overview a:hover,
        .description-container a:hover {
            color: #f0ede6;
        }

        /* ── Route list ── */
        .node-listview {
            background: transparent !important;
            margin: 2rem 0;
            animation: listIn 0.4s ease-out;
        }
        @keyframes listIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .node-listview__body {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        /* ── Route row ── */
        .route {
            display: flex !important;
            align-items: center;
            padding: 0.5rem 1rem 0.5rem 0.75rem;
            gap: 0.75rem;
            background: transparent;
            border-radius: 0;
            margin: 0;
            transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
            animation: rowIn 0.35s ease-out both;
        }
        .route:nth-child(1)  { animation-delay: 0.02s; }
        .route:nth-child(2)  { animation-delay: 0.04s; }
        .route:nth-child(3)  { animation-delay: 0.06s; }
        .route:nth-child(4)  { animation-delay: 0.08s; }
        .route:nth-child(5)  { animation-delay: 0.10s; }
        .route:nth-child(6)  { animation-delay: 0.12s; }
        .route:nth-child(7)  { animation-delay: 0.14s; }
        .route:nth-child(8)  { animation-delay: 0.16s; }
        .route:nth-child(9)  { animation-delay: 0.18s; }
        .route:nth-child(10) { animation-delay: 0.20s; }
        .route:nth-child(11) { animation-delay: 0.22s; }
        .route:nth-child(12) { animation-delay: 0.24s; }
        .route:nth-child(13) { animation-delay: 0.26s; }
        .route:nth-child(14) { animation-delay: 0.28s; }
        .route:nth-child(15) { animation-delay: 0.30s; }
        .route:nth-child(16) { animation-delay: 0.32s; }
        .route:nth-child(17) { animation-delay: 0.34s; }
        .route:nth-child(18) { animation-delay: 0.36s; }
        .route:nth-child(19) { animation-delay: 0.38s; }
        .route:nth-child(20) { animation-delay: 0.40s; }
        @keyframes rowIn {
            from { opacity: 0; transform: translateX(-6px); }
            to   { opacity: 1; transform: translateX(0); }
        }
        .route:hover {
            background: rgba(255,255,255,0.03);
            transform: translateX(3px);
        }

        /* Route number badge */
        .route .num, .route .toponum {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            color: #6b6b60;
            background: #242420;
            width: 1.6rem;
            height: 1.6rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            flex-shrink: 0;
            text-align: center;
            line-height: 1;
            transition: background 0.2s, color 0.2s;
        }
        .route:hover .num,
        .route:hover .toponum {
            background: #3a3a34;
            color: #9a9a90;
        }

        /* Route name — hero */
        .route .name {
            flex: 1;
            min-width: 0;
        }
        .route .name a,
        .route .primary-node-name {
            font-family: 'Barlow', sans-serif;
            font-size: 1rem;
            font-weight: 450;
            color: #f0ede6;
            text-decoration: none;
            transition: color 0.2s;
        }
        .route .name a:hover {
            color: #e06540;
        }

        /* Route grade — pill badge using the grade color from inline style */
        .route .r-grade {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.85rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            background: rgba(200,80,42,0.08);
            padding: 0.15rem 0.55rem;
            border-radius: 3px;
            min-width: 2.8rem;
            text-align: center;
            flex-shrink: 0;
            transition: transform 0.2s, background 0.2s;
        }
        .route:hover .r-grade {
            transform: scale(1.08);
            background: rgba(200,80,42,0.15);
        }
        .route .r-grade .difficulty {
        }

        /* Stars */
        .route .stars,
        .route .r-star {
            font-family: 'Barlow', sans-serif;
            font-size: 0.7rem;
            color: #3a3a34;
            width: 4rem;
            text-align: center;
            flex-shrink: 0;
            letter-spacing: 0.1em;
        }
        .route .stars .r-star--active {
            color: #e06540;
        }

        /* Length */
        .route .length {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            color: #6b6b60;
            min-width: 3rem;
            text-align: right;
            flex-shrink: 0;
        }

        /* ── Info cards / boxed sections ── */
        .boxed {
            background: linear-gradient(135deg, #2e2e2a 0%, #282824 100%) !important;
            border: 1px solid #3a3a34 !important;
            border-radius: 8px;
            padding: 1.5rem 1.75rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            position: relative;
        }
        .boxed::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(200,80,42,0.3), transparent);
            border-radius: 8px 8px 0 0;
        }
        .boxed .heading {
            margin: 0 0 0.75rem;
            border-left: none;
            padding-left: 0;
        }
        .boxed .heading::after {
            display: none;
        }
        .boxed .heading__t {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 1rem;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #f0ede6;
        }
        .boxed p, .boxed .boxed__content {
            font-size: 0.85rem;
            color: #b0ada6;
            line-height: 1.65;
        }
        .boxed a {
            color: #e06540;
            font-weight: 500;
        }
        .boxed a:hover {
            color: #f0ede6;
        }

        /* ── Legend ── */
        .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem 1.5rem;
            margin: 1.5rem 0;
            padding: 1rem 1.25rem;
            background: #242420;
            border: 1px solid #3a3a34;
            border-radius: 6px;
        }
        .legend__item {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #6b6b60;
        }

        /* ── Links ── */
        a {
            color: #e06540;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        a:hover {
            color: #f0ede6;
        }

        /* ── Utility panels ── */
        .panel, .panel__content, .content-box,
        .regions__summary, .area-summary {
            background: transparent !important;
        }

        /* ── News feed / updates ── */
        .news-item {
            padding: 0.75rem 0;
            border-bottom: 1px solid #2a2a26;
            transition: padding-left 0.2s;
        }
        .news-item:last-child {
            border-bottom: none;
        }
        .news-item:hover {
            padding-left: 0.75rem;
        }
        .news-item__title {
            font-family: 'Barlow', sans-serif;
            font-size: 0.9rem;
            font-weight: 400;
            color: #f0ede6;
            line-height: 1.4;
        }
        .news-item__meta {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #6b6b60;
        }

        /* ── Separators ── */
        .regions__overview + .node-listview {
            border-top: 1px solid #2a2a26;
            padding-top: 0.5rem;
        }

        /* ── Tables (some theCrag pages use tables) ── */
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid #3a3a34;
            border-radius: 6px;
            overflow: hidden;
        }
        th {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #6b6b60;
            background: #242420;
            padding: 0.5rem 0.75rem;
            text-align: left;
            border-bottom: 1px solid #3a3a34;
        }
        td {
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid #2a2a26;
            color: #c0bdb6;
            font-size: 0.85rem;
        }
        tr:last-child td {
            border-bottom: none;
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 640px) {
            .route {
                flex-wrap: wrap;
                padding: 0.4rem 0.6rem 0.4rem 0.6rem;
                gap: 0.3rem;
            }
            .route:hover {
                transform: none;
            }
            .route .r-grade {
                min-width: 2.2rem;
                font-size: 0.75rem;
                padding: 0.1rem 0.3rem;
            }
            .route .stars {
                width: 2.8rem;
            }
            .route .length {
                min-width: 2.5rem;
                font-size: 0.7rem;
            }
            .route .name a,
            .route .primary-node-name {
                font-size: 0.85rem;
            }
            .heading .heading__t {
                font-size: 1.7rem;
            }
            .boxed {
                padding: 1rem 1.25rem;
            }
        }
        .node-listview__body {
            display: flex;
            flex-direction: column;
        }

        /* ── Route row ── */
        .route {
            display: flex !important;
            align-items: center;
            padding: 0.7rem 1rem;
            border-bottom: 1px solid #2a2a26;
            gap: 0.75rem;
            transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
            border-radius: 4px;
            margin-bottom: 2px;
            position: relative;
        }
        .route:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .route:hover {
            background: #2a2a26;
            transform: translateX(4px);
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        /* Route number badge */
        .route .num, .route .toponum {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.7rem;
            font-weight: 700;
            color: #6b6b60;
            background: #2a2a26;
            width: 1.8rem;
            height: 1.8rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            flex-shrink: 0;
            text-align: center;
            line-height: 1;
            transition: background 0.15s, color 0.15s;
        }
        .route:hover .num,
        .route:hover .toponum {
            background: #3a3a34;
            color: #8a8a80;
        }

        /* Route name — hero */
        .route .name {
            flex: 1;
            min-width: 0;
        }
        .route .name a,
        .route .primary-node-name {
            font-family: 'Barlow', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            color: #f0ede6;
            text-decoration: none;
            transition: color 0.15s;
        }
        .route .name a:hover {
            color: #e06540;
        }

        /* Route grade — pill badge */
        .route .r-grade {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.85rem;
            font-weight: 800;
            letter-spacing: 0.06em;
            color: #c8502a;
            background: rgba(200,80,42,0.1);
            padding: 0.15rem 0.5rem;
            border-radius: 3px;
            min-width: 2.8rem;
            text-align: center;
            flex-shrink: 0;
            transition: background 0.15s;
        }
        .route:hover .r-grade {
            background: rgba(200,80,42,0.18);
        }
        .route .r-grade .difficulty {
            color: #c8502a;
        }

        /* Stars */
        .route .stars,
        .route .r-star {
            font-size: 0.7rem;
            color: #3a3a34;
            width: 4rem;
            text-align: center;
            flex-shrink: 0;
            letter-spacing: 0.08em;
        }
        .route .stars .r-star--active {
            color: #e06540;
        }

        /* Length */
        .route .length {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.78rem;
            font-weight: 600;
            color: #6b6b60;
            width: 3.5rem;
            text-align: right;
            flex-shrink: 0;
        }

        /* ── Info cards / boxed sections ── */
        .boxed {
            background: #2e2e2a !important;
            border: 1px solid #3a3a34 !important;
            border-radius: 6px;
            padding: 1.5rem 1.75rem;
            margin-bottom: 1.25rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .boxed .heading {
            margin: 0 0 0.75rem;
            border-left: none;
            padding-left: 0;
        }
        .boxed .heading::after {
            display: none;
        }
        .boxed .heading__t {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #f0ede6;
        }
        .boxed p, .boxed .boxed__content {
            font-size: 0.85rem;
            color: #b0ada6;
            line-height: 1.6;
        }
        .boxed a {
            color: #e06540;
            font-weight: 500;
        }
        .boxed a:hover {
            color: #f0ede6;
        }

        /* ── Legend ── */
        .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem 1.5rem;
            margin: 1.25rem 0;
            padding: 1rem 1.25rem;
            background: #2e2e2a;
            border: 1px solid #3a3a34;
            border-radius: 6px;
        }
        .legend__item {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #6b6b60;
        }

        /* ── Links ── */
        a {
            color: #e06540;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.15s;
        }
        a:hover {
            color: #f0ede6;
        }

        /* ── Utility panels ── */
        .panel, .panel__content, .content-box,
        .regions__summary, .area-summary {
            background: transparent !important;
        }

        /* ── News feed / updates ── */
        .news-item {
            padding: 0.75rem 0;
            border-bottom: 1px solid #3a3a34;
            transition: padding-left 0.15s;
        }
        .news-item:last-child {
            border-bottom: none;
        }
        .news-item:hover {
            padding-left: 0.5rem;
        }
        .news-item__title {
            font-family: 'Barlow', sans-serif;
            font-size: 0.9rem;
            font-weight: 400;
            color: #f0ede6;
            line-height: 1.4;
        }
        .news-item__meta {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #6b6b60;
        }

        /* ── Separator between sections ── */
        .regions__overview + .node-listview {
            border-top: 1px solid #2a2a26;
            padding-top: 0.5rem;
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 640px) {
            .route {
                flex-wrap: wrap;
                padding: 0.5rem 0.75rem;
                gap: 0.4rem;
            }
            .route:hover {
                transform: none;
            }
            .route .r-grade {
                min-width: 2.4rem;
                font-size: 0.75rem;
                padding: 0.1rem 0.35rem;
            }
            .route .stars {
                width: 3rem;
            }
            .route .length {
                width: 2.8rem;
            }
            .route .name a,
            .route .primary-node-name {
                font-size: 0.85rem;
            }
            .heading .heading__t {
                font-size: 1.6rem;
            }
        }
    </style>"""]

    # Extract body content
    body_tag = soup.find('body')
    if body_tag:
        fragments.extend(str(c) for c in body_tag.children)

    return Response('\n'.join(fragments), mimetype='text/html')

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
        html, parsed = fetch_thecrag_html(url)
    except ValueError as e:
        return api_error(str(e))
    except Exception as e:
        return api_error(f'Failed to fetch URL: {e}')

    topo_data = parsed['topo']
    title = (d.get('title') or '').strip() or topo_data['title']
    filename = title + '.html'
    dest = UPLOAD_FOLDER / filename
    dest.write_text(html)

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
    conn.commit()
    conn.close()

    return ok(topo_id=topo_id, topo_name=title, routes_parsed=len(parsed['routes'])), 201


@app.route('/api/topos/<int:topo_id>', methods=['DELETE'])
@jwt_required()
def delete_topo(topo_id):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    conn = get_db()
    conn.execute('DELETE FROM topos WHERE id=?', (topo_id,))
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
    conn.execute('INSERT INTO routes (topo_id, name, grade, sorting_grade, length, route_index) VALUES (?,?,?,?,?,?)', (topo_id, name, grade, grade_sort_key(grade), length, route_index))
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
    cursor = conn.execute('SELECT id, parking_lat FROM topos WHERE id=?', (topo_id,)).fetchone()
    if not cursor:
        conn.close(); return api_error('Topo not found', 404)
    if cursor['parking_lat']: return api_error('Parking location already set', 409)
    conn.execute('UPDATE topos SET parking_lat=?, parking_lon=? WHERE id=?', (lat, lon, topo_id))
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
    cursor = conn.execute('SELECT id, routes_lat FROM topos WHERE id=?', (topo_id,)).fetchone()
    if not cursor:
        conn.close(); return api_error('Topo not found', 404)
    if cursor['routes_lat']: return api_error('Routes location already set', 409)
    conn.execute('UPDATE topos SET routes_lat=?, routes_lon=? WHERE id=?', (lat, lon, topo_id))
    conn.commit()
    routes_location = conn.execute('SELECT routes_lat, routes_lon FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    return ok(routes_location=dict(routes_location))

# ── ROUTES ────────────────────────────────────────────────────────────────────
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
    tags = conn.execute('SELECT t.id, t.name FROM tag_routes tr JOIN tags t ON tr.tag_id=t.id WHERE tr.route_id=?', (route_id,)).fetchall()

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

    return ok(route=dict(route), comments=comments_out, attempt=dict(attempt) if attempt else None, tags=[dict(t) for t in tags], avg_perceived_grade=avg_perceived, is_project=is_project, project_sent=project_sent)

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
    route = conn.execute('SELECT id FROM routes WHERE id=?', (route_id,)).fetchone()
    if not route:
        conn.close(); return api_error('Route not found', 404)

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

# ── ATTEMPTS ─────────────────────────────────────────────────────────────────
@app.route('/api/routes/<int:route_id>/add_attempt', methods=['GET'])
@jwt_required()
def add_attempt(route_id):
    user_id = int(get_jwt_identity())
    conn = get_db()
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    if not attempt:
        conn.execute('INSERT INTO attempts (user_id, route_id, amount) VALUES (?,?,1)', (user_id, route_id))
    else:
        if not attempt['sent']:
            conn.execute('UPDATE attempts SET amount=amount+1 WHERE user_id=? AND route_id=?', (user_id, route_id))
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    conn.commit()
    conn.close()
    return ok(attempt=dict(attempt))

@app.route('/api/routes/<int:route_id>/sent_attempt', methods=['GET'])
@jwt_required()
def sent_attempt(route_id):
    user_id = int(get_jwt_identity())
    conn = get_db()
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    if not attempt:
        conn.execute('INSERT INTO attempts (user_id, route_id, amount, sent, sent_at) VALUES (?,?,1,1,CURRENT_TIMESTAMP)', (user_id, route_id))
    else:
        if not attempt['sent']:
            conn.execute('UPDATE attempts SET amount=amount+1 WHERE user_id=? AND route_id=?', (user_id, route_id))
            conn.execute('UPDATE attempts SET sent=1 WHERE user_id=? AND route_id=?', (user_id, route_id))
            conn.execute('UPDATE attempts SET sent_at=CURRENT_TIMESTAMP WHERE user_id=? AND route_id=?', (user_id, route_id))
    # If this route was a project, mark it sent too
    conn.execute('UPDATE projects SET sent=1 WHERE user_id=? AND route_id=?', (user_id, route_id))
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    conn.commit()
    conn.close()
    return ok(attempt=dict(attempt))

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
    existing = conn.execute('SELECT id FROM comments WHERE user_id=? AND route_id=?', (uid, route_id)).fetchone()
    if existing:
        conn.execute('UPDATE comments SET stars=?, perceived_grade=?, body=?, beta=? WHERE user_id=? AND route_id=?', (stars, perceived_grade, body, beta, uid, route_id))
    else:
        conn.execute('INSERT INTO comments (user_id, route_id, stars, perceived_grade, body, beta) VALUES (?,?,?,?,?,?)', (uid, route_id, stars, perceived_grade, body, beta))
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
    conn.execute('DELETE FROM comments WHERE id=?', (comment_id,))
    conn.commit(); conn.close()
    return ok(deleted=True)

# ── SEARCH ────────────────────────────────────────────────────────────────────
@app.route('/api/search', methods=['GET'])
@jwt_required()
def search():
    q             = (request.args.get('q') or '').strip()
    tag_ids       = request.args.getlist('tag_ids')
    projects_only = request.args.get('projects_only')

    conn = get_db()

    # Build route query — optionally filter by tags
    if tag_ids:
        placeholders = ','.join('?' * len(tag_ids))
        route_rows = conn.execute(
            f'''SELECT DISTINCT r.* FROM routes r
                JOIN tag_routes tr ON tr.route_id = r.id
                WHERE tr.tag_id IN ({placeholders})''',
            tag_ids
        ).fetchall()
    else:
        route_rows = conn.execute('SELECT * FROM routes').fetchall()

    if projects_only:
        project_route_ids = set(
            r['route_id'] for r in conn.execute(
                'SELECT route_id FROM projects WHERE user_id=?', (int(get_jwt_identity()),)
            ).fetchall()
        )
        route_rows = [r for r in route_rows if r['id'] in project_route_ids]

    topo_rows = conn.execute('SELECT * FROM topos').fetchall()
    conn.close()

    route_by_name = {r['name']: dict(r) for r in route_rows}
    topo_by_title = {t['title']: dict(t) for t in topo_rows}

    if q:
        matched_route_names  = fuzzy_search(q, list(route_by_name.keys()))[:20]
        matched_topo_titles  = fuzzy_search(q, list(topo_by_title.keys()))[:20]
        routes = [route_by_name[n] for n in matched_route_names if n in route_by_name]
        topos  = [topo_by_title[t] for t in matched_topo_titles  if t in topo_by_title]
    else:
        # tag-only filter: return all matched routes, no topo filtering
        routes = list(route_by_name.values())[:40]
        topos  = []

    return ok(routes=routes, topos=topos)

# ── TAGS ──────────────────────────────────────────────────────────────────────

@app.route('/api/tags', methods=['GET'])
@jwt_required()
def list_tags():
    """Return all tags, each with the count of routes using them."""
    conn = get_db()
    tags = conn.execute('''
        SELECT t.id, t.name, COUNT(tr.route_id) as route_count
        FROM tags t
        LEFT JOIN tag_routes tr ON tr.tag_id = t.id
        GROUP BY t.id
        ORDER BY t.name
    ''').fetchall()
    conn.close()
    return ok(tags=[dict(t) for t in tags])

@app.route('/api/tags', methods=['POST'])
@jwt_required()
def create_tag():
    """Create a new tag. Returns existing tag if name already exists."""
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    name = (d.get('name') or '').strip().lower()
    if not name: return api_error('Tag name required')
    conn = get_db()
    existing = conn.execute('SELECT * FROM tags WHERE name=?', (name,)).fetchone()
    if existing:
        conn.close()
        return ok(tag=dict(existing)), 200
    conn.execute('INSERT INTO tags (name) VALUES (?)', (name,))
    conn.commit()
    tag = conn.execute('SELECT * FROM tags WHERE name=?', (name,)).fetchone()
    conn.close()
    return ok(tag=dict(tag)), 201

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
    tag = conn.execute('SELECT * FROM tags WHERE id=?', (tag_id,)).fetchone()
    if not tag:
        conn.close(); return api_error('Tag not found', 404)
    # Upsert (ignore if already assigned)
    conn.execute(
        'INSERT OR IGNORE INTO tag_routes (route_id, tag_id) VALUES (?,?)',
        (route_id, tag_id)
    )
    conn.commit()
    tags = conn.execute(
        'SELECT t.id, t.name FROM tag_routes tr JOIN tags t ON tr.tag_id=t.id WHERE tr.route_id=?',
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
    conn.execute(
        'DELETE FROM tag_routes WHERE route_id=? AND tag_id=?',
        (route_id, tag_id)
    )
    conn.commit()
    tags = conn.execute(
        'SELECT t.id, t.name FROM tag_routes tr JOIN tags t ON tr.tag_id=t.id WHERE tr.route_id=?',
        (route_id,)
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
        conn.execute('DELETE FROM projects WHERE id=?', (existing['id'],))
        is_project = False
    else:
        conn.execute('INSERT INTO projects (user_id, route_id) VALUES (?,?)', (user_id, route_id))
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
    conn.close()

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

    return ok(
        max_grade=max_grade,
        grade_pyramid=grade_pyramid,
        avg_attempts_per_grade=avg_attempts,
        working=working,
        summary={
            'total_sent':     len(sent_rows),
            'total_attempts': sum(r['amount'] for r in rows),
            'total_working':  len(working_rows),
        },
        username=target_username,
    )

# ── OOPS REPORTS ────────────────────────────────────────────────────────────
@app.route('/api/oops', methods=['POST'])
@jwt_required()
def submit_oops():
    user = require_user()
    d = request.get_json() or {}
    explanation = (d.get('explanation') or '').strip()
    if not explanation:
        return api_error('Explanation is required')

    conn = get_db()
    row = conn.execute(
        'SELECT id FROM oops_reports WHERE user_id=? AND created_at > datetime("now", "-1 day")',
        (user['id'],)
    ).fetchone()
    if row:
        conn.close()
        return api_error('You can only submit one Oops report per day', 429)

    route_name = (d.get('route_name') or '').strip() or None
    topo_name = (d.get('topo_name') or '').strip() or None
    concerned_user = (d.get('concerned_user') or '').strip() or None

    conn.execute(
        'INSERT INTO oops_reports (user_id, explanation, route_name, topo_name, concerned_user) VALUES (?,?,?,?,?)',
        (user['id'], explanation, route_name, topo_name, concerned_user)
    )
    conn.commit()
    conn.close()
    return ok(submitted=True), 201


# ── RECOMMENDATIONS ─────────────────────────────────────────────────────────
@app.route('/api/recommendations', methods=['POST'])
@jwt_required()
def submit_recommendation():
    user = require_user()
    d = request.get_json() or {}
    username = (d.get('username') or '').strip()
    email = (d.get('email') or '').strip()
    if not username or not email:
        return api_error('Username and email are required')

    conn = get_db()
    row = conn.execute(
        'SELECT id FROM recommendations WHERE user_id=? AND created_at > datetime("now", "-1 day")',
        (user['id'],)
    ).fetchone()
    if row:
        conn.close()
        return api_error('You can only submit one recommendation per day', 429)

    conn.execute(
        'INSERT INTO recommendations (user_id, username, email) VALUES (?,?,?)',
        (user['id'], username, email)
    )
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
    oops = conn.execute('''
        SELECT o.*, u.username as submitter_name
        FROM oops_reports o
        LEFT JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
    ''').fetchall()
    recs = conn.execute('''
        SELECT r.*, u.username as submitter_name
        FROM recommendations r
        LEFT JOIN users u ON u.id = r.user_id
        ORDER BY r.created_at DESC
    ''').fetchall()
    conn.close()

    items = []
    for r in oops:
        d = dict(r)
        d['type'] = 'oops'
        items.append(d)
    for r in recs:
        d = dict(r)
        d['type'] = 'recommendation'
        items.append(d)

    items.sort(key=lambda x: x['created_at'], reverse=True)
    return ok(items=items)

@app.route('/api/admin/notifications/<string:ntype>/<int:nid>/resolve', methods=['PATCH'])
@jwt_required()
def resolve_notification(ntype, nid):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)

    table = {'oops': 'oops_reports', 'recommendation': 'recommendations'}.get(ntype)
    if not table:
        return api_error('Invalid notification type', 400)

    conn = get_db()
    conn.execute(f'UPDATE {table} SET resolved=1 WHERE id=?', (nid,))
    conn.commit()
    conn.close()
    return ok(resolved=True)

@app.route('/api/admin/notifications/<string:ntype>/<int:nid>', methods=['DELETE'])
@jwt_required()
def delete_notification(ntype, nid):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)

    table = {'oops': 'oops_reports', 'recommendation': 'recommendations'}.get(ntype)
    if not table:
        return api_error('Invalid notification type', 400)

    conn = get_db()
    conn.execute(f'DELETE FROM {table} WHERE id=?', (nid,))
    conn.commit()
    conn.close()
    return ok(deleted=True)


if __name__ == '__main__':
    init_db()
    seed.seed()
    app.run(debug=True, port=5757, host='0.0.0.0')

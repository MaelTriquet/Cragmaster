import os
import hashlib
from pathlib import Path
from datetime import timedelta, date
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from db import get_db, init_db
from auth import hash_password, check_password, get_current_user, require_user, require_admin
from ocr import extract_text_from_pdf, extract_routes, parse_routes, grade_sort_key
import seed
from fzf import fuzzy_search

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET', 'topo-secret-change-in-prod')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)
UPLOAD_FOLDER = Path('/app/uploads')
UPLOAD_FOLDER.mkdir(exist_ok=True)

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
def login():
    d = request.get_json() or {}
    username = (d.get('username') or '').strip()
    password = (d.get('password') or '').strip()
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE username=?', (username,)).fetchone()
    conn.close()
    if not user or not check_password(password, user['password_hash']):
        return api_error('Invalid username or password', 401)
    token = create_access_token(identity=str(user['id']))
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
    new_username = (d.get('username') or '').strip()
    new_password = (d.get('password') or '').strip()
 
    if not new_username:
        return api_error('Username cannot be empty')
 
    conn = get_db()
    # Check username not taken by someone else
    conflict = conn.execute(
        'SELECT id FROM users WHERE username=? AND id!=?',
        (new_username, user['id'])
    ).fetchone()
    if conflict:
        conn.close()
        return api_error('Username already taken', 409)
 
    if new_password:
        conn.execute(
            'UPDATE users SET username=?, password_hash=? WHERE id=?',
            (new_username, hash_password(new_password), user['id'])
        )
    else:
        conn.execute(
            'UPDATE users SET username=? WHERE id=?',
            (new_username, user['id'])
        )
 
    conn.commit()
    updated = conn.execute('SELECT id, username, is_admin FROM users WHERE id=?', (user['id'],)).fetchone()
    conn.close()
    return ok(user=dict(updated))

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
def list_topos():
    conn = get_db()
    rows = conn.execute('''SELECT * FROM topos ORDER BY title''').fetchall()
    conn.close()
    return ok([dict(r) for r in rows])

@app.route('/api/topos/<int:topo_id>', methods=['GET'])
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
def serve_pdf(topo_id):
    conn = get_db()
    row = conn.execute('SELECT filename FROM topos WHERE id=?', (topo_id,)).fetchone()
    conn.close()
    if not row: return api_error('Not found', 404)
    return send_file(UPLOAD_FOLDER / row['filename'], mimetype='application/pdf', download_name=row['filename'], as_attachment=True)

@app.route('/api/topos/upload', methods=['POST'])
@jwt_required()
def upload_topo():
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    if 'pdf' not in request.files: return api_error('No PDF file provided')
    f = request.files['pdf']
    filename = f.filename
    title    = (request.form.get('title') or '').strip() or Path(filename).stem
    raw = f.read()
    dest = UPLOAD_FOLDER / f'{filename}'
    if not dest.exists(): dest.write_bytes(raw)
    conn = get_db()
    existing = conn.execute('SELECT id FROM topos WHERE filename=?', (filename,)).fetchone()
    if existing: conn.close(); return api_error('This PDF is already in the library', 409)
    ocr_text = extract_text_from_pdf(str(dest))
    cursor = conn.execute('INSERT INTO topos (filename, title, uploaded_by) VALUES (?,?,?)', (f.filename, title, user['id']))
    topo_id = cursor.lastrowid
    parsed = parse_routes(ocr_text, topo_id)
    for r in parsed:
        conn.execute('INSERT INTO routes (topo_id, name, grade, sorting_grade, route_index, length) VALUES (?,?,?,?,?,?)', (topo_id, r['name'], r['grade'], r['sorting_grade'], r['index'], r['length']))
    conn.commit()
    conn.close()
    return ok(routes_parsed=len(parsed)), 201

@app.route('/api/topos/<int:topo_id>', methods=['DELETE'])
@jwt_required()
def delete_topo(topo_id):
    try: require_admin()
    except PermissionError as e: return api_error(str(e), 403)
    conn = get_db()
    cursor = conn.execute('SELECT id FROM routes WHERE topo_id=?', (topo_id,)).fetchall()
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
    cursor = conn.execute('SELECT id FROM routes WHERE topo_id=? AND route_index=?', (topo_id, route_index)).fetchone()
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
    print("request received")
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
    cursor = conn.execute('UPDATE topos SET parking_lat=?, parking_lon=? WHERE id=?', (lat, lon, topo_id))
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
    cursor = conn.execute('UPDATE topos SET routes_lat=?, routes_lon=? WHERE id=?', (lat, lon, topo_id))
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
    if user: attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user['id'], route_id)).fetchone()
    tags = conn.execute('SELECT t.name FROM tag_routes tr JOIN tags t ON tr.tag_id=t.id WHERE tr.route_id=?', (route_id,)).fetchall()
    conn.close()
    return ok(route=dict(route), comments=[dict(c) for c in comments], attempt=dict(attempt) if attempt else None, tags=[dict(t) for t in tags])



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
    attempt = conn.execute('SELECT * FROM attempts WHERE user_id=? AND route_id=?', (user_id, route_id)).fetchone()
    conn.commit()
    conn.close()
    return ok(attempt=dict(attempt))

# ── COMMENTS ─────────────────────────────────────────────────────────────────
@app.route('/api/routes/<int:route_id>/comments', methods=['GET'])
def get_comments(route_id):
    conn = get_db()
    rows = conn.execute('''SELECT c.*, u.username FROM comments c JOIN users u ON u.id=c.user_id WHERE c.route_id=? ORDER BY c.created_at DESC''', (route_id,)).fetchall()
    conn.close(); return ok([dict(r) for r in rows])

@app.route('/api/routes/<int:route_id>/comments', methods=['POST'])
@jwt_required()
def upsert_comment(route_id):
    uid = int(get_jwt_identity())
    d   = request.get_json() or {}
    stars           = float(d.get('stars', 0))
    perceived_grade = (d.get('perceived_grade') or '').strip()
    body            = (d.get('body') or '').strip()
    conn = get_db()
    existing = conn.execute('SELECT id FROM comments WHERE user_id=? AND route_id=?', (uid, route_id)).fetchone()
    if existing:
        conn.execute('UPDATE comments SET stars=?, perceived_grade=?, body=? WHERE user_id=? AND route_id=?', (stars, perceived_grade, body, uid, route_id))
    else:
        conn.execute('INSERT INTO comments (user_id, route_id, stars, perceived_grade, body) VALUES (?,?,?,?,?)', (uid, route_id, stars, perceived_grade, body))
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
def search():
    q = (request.args.get('q') or '').strip()
    if not q: return ok(topos=[], routes=[])

    conn = get_db()
    route_rows = conn.execute('SELECT * FROM routes').fetchall()
    topo_rows  = conn.execute('SELECT * FROM topos').fetchall()
    conn.close()

    # Build lookup dicts by name/title
    route_by_name = {r['name']: dict(r) for r in route_rows}
    topo_by_title = {t['title']: dict(t) for t in topo_rows}

    # Fuzzy search returns names/titles in ranked order
    matched_route_names = fuzzy_search(q, list(route_by_name.keys()))[:20]
    matched_topo_titles = fuzzy_search(q, list(topo_by_title.keys()))[:20]

    # Reconstruct results preserving fuzzy rank order
    routes = [route_by_name[name] for name in matched_route_names if name in route_by_name]
    topos  = [topo_by_title[title] for title in matched_topo_titles if title in topo_by_title]

    return ok(routes=routes, topos=topos)

# ── TAG ────────────────────────────────────────────────────────────────────

# TODO: implement tag logic (filtering search results)

@app.route('/api/tags', methods=['GET'])
def list_tags():
    conn = get_db()
    tags = conn.execute('SELECT * FROM tags').fetchall()
    conn.close()
    return ok(tags=dict(tags))

@app.route('/api/tags/create', methods=['POST'])
@jwt_required()
def create_tag():
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    name = (d.get('name') or '').strip()
    if not name: return api_error('Name required')
    conn = get_db()
    conn.execute('INSERT INTO tags (name) VALUES (?)', (name,))
    conn.commit()
    tag = conn.execute('SELECT * FROM tags WHERE name=?', (name,)).fetchone()
    conn.close()
    return ok(tag=dict(tag))

@app.route('/api/tags/assign', methods=['POST'])
@jwt_required()
def assign_tag():
    user = get_current_user()
    if not user: return api_error('Authentication required', 401)
    d = request.get_json() or {}
    tag_id = (d.get('tag_id') or '').strip()
    route_id = (d.get('route_id') or '').strip()
    if not tag_id or not route_id: return api_error('Error when assigning tag')
    conn = get_db()
    conn.execute('INSERT INTO tag_routes (route_id, tag_id) VALUES (?,?)', (route_id, tag_id))
    conn.commit()
    conn.close()
    return ok(tag=tag_id)

# ── STATS ──────────────────────────────────────────────────────────────────────
@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    conn = get_db()

    # All attempts for this user, joined with route info
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

    # Max grade sent (by sorting_grade)
    max_grade = None
    if sent_rows:
        best = max(sent_rows, key=lambda r: r['sorting_grade'])
        max_grade = {'grade': best['grade'], 'sorting_grade': best['sorting_grade']}

    # Grade pyramid — count of sent routes per grade
    grade_counts = {}
    for r in sent_rows:
        g = r['grade']
        if g not in grade_counts:
            grade_counts[g] = {'grade': g, 'sorting_grade': r['sorting_grade'], 'count': 0}
        grade_counts[g]['count'] += 1
    grade_pyramid = sorted(grade_counts.values(), key=lambda x: x['sorting_grade'])

    # Average attempts per grade (sent only — fair comparison)
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

    # Working routes (attempted but not sent)
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

    # Summary numbers
    total_sent     = len(sent_rows)
    total_attempts = sum(r['amount'] for r in rows)
    total_working  = len(working_rows)

    return ok(
        max_grade=max_grade,
        grade_pyramid=grade_pyramid,
        avg_attempts_per_grade=avg_attempts,
        working=working,
        summary={
            'total_sent':     total_sent,
            'total_attempts': total_attempts,
            'total_working':  total_working,
        }
    )

if __name__ == '__main__':
    init_db()
    seed.seed()
    app.run(debug=True, port=5757, host='0.0.0.0')

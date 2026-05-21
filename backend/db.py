import sqlite3
import os
import sys

DB_PATH = os.environ.get('DB_PATH', '/app/db/topos.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def query(sql):
    conn = get_db()
    cursor = conn.execute(sql)
    conn.close()
    return cursor

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            username      TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin      INTEGER DEFAULT 0,
            token_version INTEGER DEFAULT 0,
            banned_until  DATETIME DEFAULT NULL
        );

        CREATE TABLE IF NOT EXISTS topos (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            filename      TEXT NOT NULL,
            title         TEXT NOT NULL,
            parking_lat   REAL DEFAULT NULL,
            parking_lon   REAL DEFAULT NULL,
            routes_lat    REAL DEFAULT NULL,
            routes_lon    REAL DEFAULT NULL,
            uploaded_by   INTEGER REFERENCES users(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS routes (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            topo_id    INTEGER REFERENCES topos(id) ON DELETE CASCADE,
            route_index      INTEGER DEFAULT -1,
            name       TEXT NOT NULL,
            grade      TEXT DEFAULT '',
            sorting_grade INTEGER DEFAULT -1,
            length   REAL DEFAULT -1
        );

        CREATE TABLE IF NOT EXISTS attempts (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
            route_id   INTEGER REFERENCES routes(id) ON DELETE CASCADE,
            sent       INTEGER DEFAULT 0,
            amount     INTEGER DEFAULT 0,
            sent_at  DATETIME DEFAULT NULL,
            UNIQUE(user_id, route_id)
        );

        CREATE TABLE IF NOT EXISTS comments (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
            route_id        INTEGER REFERENCES routes(id) ON DELETE CASCADE,
            stars           REAL DEFAULT 0,
            perceived_grade TEXT DEFAULT '',
            body            TEXT DEFAULT '',
            beta            TEXT DEFAULT '',
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, route_id)
        );

        CREATE TABLE IF NOT EXISTS tags (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            name_fr    TEXT DEFAULT NULL,
            category   TEXT NOT NULL DEFAULT 'other'
        );

        CREATE TABLE IF NOT EXISTS tag_routes (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            route_id   INTEGER REFERENCES routes(id) ON DELETE CASCADE,
            tag_id     INTEGER REFERENCES tags(id) ON DELETE CASCADE,
            UNIQUE(route_id, tag_id)
        );

        CREATE TABLE IF NOT EXISTS projects (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
            route_id   INTEGER REFERENCES routes(id) ON DELETE CASCADE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            sent       INTEGER DEFAULT 0,
            UNIQUE(user_id, route_id)
        );

        CREATE TABLE IF NOT EXISTS oops_reports (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
            explanation     TEXT NOT NULL,
            route_name      TEXT DEFAULT NULL,
            topo_name       TEXT DEFAULT NULL,
            concerned_user  TEXT DEFAULT NULL,
            resolved        INTEGER DEFAULT 0,
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
            body       TEXT NOT NULL,
            category   TEXT NOT NULL DEFAULT 'other',
            resolved   INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS coming_soon (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS coming_soon_votes (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            feature_id  INTEGER REFERENCES coming_soon(id) ON DELETE CASCADE,
            user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
            vote        INTEGER NOT NULL,
            UNIQUE(feature_id, user_id)
        );
    ''')

    # Migrations
    for table, col, col_type in [('users', 'token_version', 'INTEGER DEFAULT 0'), ('oops_reports', 'resolved', 'INTEGER DEFAULT 0'), ('comments', 'beta', 'TEXT DEFAULT ""'), ('projects', 'sent', 'INTEGER DEFAULT 0'), ('users', 'banned_until', 'DATETIME DEFAULT NULL'), ('tags', 'category', 'TEXT NOT NULL DEFAULT \'other\''), ('tags', 'name_fr', 'TEXT DEFAULT NULL'), ('routes', 'photo', 'TEXT DEFAULT NULL'), ('users', 'email', 'TEXT DEFAULT NULL'), ('users', 'email_prompt_dismissed', 'INTEGER DEFAULT 0')]:
        try:
            conn.execute(f'ALTER TABLE {table} ADD COLUMN {col} {col_type}')
        except Exception:
            pass

    # Seed predefined tags (idempotent)
    seed_tags = [
        ('slab', 'Dalle', 'route_style'),
        ('overhand', 'D\u00e9vers', 'route_style'),
        ('roof', 'Toit', 'route_style'),
        ('dihedral', 'Di\u00e8dre', 'route_style'),
        ('crack', 'Fissure', 'route_style'),
        ('ridge', 'Ar\u00eate', 'route_style'),
        ('vertical', 'Vertical', 'route_style'),
        ('crimp', 'R\u00e9glettes', 'hold'),
        ('sloper', 'Plats', 'hold'),
        ('pinch', 'Pinces', 'hold'),
        ('mono', 'Monodoigt', 'hold'),
        ('jug', 'Bac', 'hold'),
        ('smear', 'Adh\u00e9rence', 'hold'),
        ('easy', 'Facile', 'approach'),
        ('medium', 'Moyen', 'approach'),
        ('hard', 'Difficile', 'approach'),
        ('<10min', '<10min', 'approach'),
        ('10min-20min', '10min-20min', 'approach'),
        ('20min-30min', '20min-30min', 'approach'),
        ('>30min', '>30min', 'approach'),
        ('north', 'Nord', 'exposure'),
        ('south', 'Sud', 'exposure'),
        ('east', 'Est', 'exposure'),
        ('west', 'Ouest', 'exposure'),
        ('north-east', 'Nord-Est', 'exposure'),
        ('north-west', 'Nord-Ouest', 'exposure'),
        ('south-east', 'Sud-Est', 'exposure'),
        ('south-west', 'Sud-Ouest', 'exposure'),
        ('endurance', 'Endurance', 'style'),
        ('technique', 'Technique', 'style'),
        ('powerful', 'Puissant', 'style'),
        ('boulder', 'Bloc', 'style'),
        ('reading', 'Lecture', 'style'),
        ('reachy', '"Reachy"', 'style'),
        ('need-a-crashpad', 'Besoin d\u2019un crashpad', 'other'),
    ]
    for name, name_fr, category in seed_tags:
        try:
            cursor = conn.execute('SELECT id FROM tags WHERE name=?', (name,)).fetchone()
            if cursor:
                conn.execute('UPDATE tags SET name_fr=?, category=? WHERE id=?', (name_fr, category, cursor['id']))
            else:
                conn.execute('INSERT INTO tags (name, name_fr, category) VALUES (?,?,?)', (name, name_fr, category))
        except Exception:
            pass

    conn.commit()
    conn.close()

if __name__ == '__main__':
    sql_query = sys.argv[1]
    if sql_query:
        print(query(sql_query))

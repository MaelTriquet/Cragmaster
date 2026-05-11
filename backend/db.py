import sqlite3
import os

DB_PATH = os.environ.get('DB_PATH', '/app/db/topos.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    print('Creating tables...')
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            username      TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin      INTEGER DEFAULT 0
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
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, route_id)
        );

        CREATE TABLE IF NOT EXISTS tags (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tag_routes (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            route_id   INTEGER REFERENCES routes(id) ON DELETE CASCADE,
            tag_id     INTEGER REFERENCES tags(id) ON DELETE CASCADE,
            UNIQUE(route_id, tag_id)
        );
    ''')
    conn.commit()
    conn.close()

"""Create the admin user if none exists."""
import os
from db import get_db, init_db
from auth import hash_password

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')

def seed():
    init_db()
    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE username='admin'").fetchone()
    if not existing and ADMIN_PASSWORD:
        conn.execute(
            "INSERT INTO users (username, password_hash, is_admin) VALUES (?,?,1)",
            ('admin', hash_password(ADMIN_PASSWORD))
        )
        conn.commit()
    conn.close()

if __name__ == '__main__':
    seed()

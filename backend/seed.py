"""Run once to create the admin user."""
from db import get_db, init_db
from auth import hash_password

def seed():
    init_db()
    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE username='admin'").fetchone()
    if existing:
        print("Admin user already exists.")
    else:
        conn.execute(
            "INSERT INTO users (username, password_hash, is_admin) VALUES (?,?,1)",
            ('admin', hash_password('admin'))
        )
        conn.commit()
        print("Admin user created: admin / admin")
    conn.close()

if __name__ == '__main__':
    seed()

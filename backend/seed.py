# Cragmaster - climbing topo manager
# Copyright (C) 2026  mtriquet
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

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

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

import bcrypt
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from db import get_db

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

def get_current_user():
    """Returns user row or None if not authenticated."""
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        if not uid:
            return None
        conn = get_db()
        user = conn.execute('SELECT * FROM users WHERE id=?', (int(uid),)).fetchone()
        conn.close()
        return user
    except Exception:
        return None

def require_user():
    """Returns user or raises 401."""
    user = get_current_user()
    if not user:
        raise PermissionError('Authentication required')
    return user

def require_admin():
    user = require_user()
    if not user['is_admin']:
        raise PermissionError('Admin access required')
    return user

// Cragmaster - climbing topo manager
// Copyright (C) 2026  mtriquet
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/client'
import { getConnectionStatus, isOnline, ping } from '../lib/offline'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, rehydrate user from stored token
  useEffect(() => {
    (async () => {
      if (getConnectionStatus() === 0) await ping()
      const token = localStorage.getItem('token')
      if (!token) { setLoading(false); return }

      if (!isOnline()) {
        const cached = localStorage.getItem('user')
        if (cached) {
          try { setUser(JSON.parse(cached)); setLoading(false); return } catch {}
        }
        const decoded = decodeToken(token)
        if (decoded?.sub) {
          setUser({ id: Number(decoded.sub), username: '...', is_admin: false })
        }
        setLoading(false)
        return
      }

      try {
        const res = await authApi.me()
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        } else {
          const cached = localStorage.getItem('user')
          if (cached) {
            try { setUser(JSON.parse(cached)) } catch {}
          }
        }
      }
      setLoading(false)
    })()
  }, [])

  const login = async (username, password, remember = false) => {
    const res = await authApi.login(username, password, remember)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await authApi.me()
      setUser(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

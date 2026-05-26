import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/client'
import { isOnline } from '../lib/offline'

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

    authApi.me()
      .then(res => {
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        } else {
          const cached = localStorage.getItem('user')
          if (cached) {
            try { setUser(JSON.parse(cached)) } catch {}
          }
        }
      })
      .finally(() => setLoading(false))
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

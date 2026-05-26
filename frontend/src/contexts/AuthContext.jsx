import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, rehydrate user from stored token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    authApi.me()
      .then(res => setUser(res.data.user))
      .catch(err => {
        // Only wipe the token on explicit auth failures, not network errors
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password, remember = false) => {
    const res = await authApi.login(username, password, remember)
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await authApi.me()
      setUser(res.data.user)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

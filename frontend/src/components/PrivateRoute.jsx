import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span style={{ color: 'var(--muted)', fontFamily: 'Barlow Condensed', fontSize: '1.2rem', letterSpacing: '0.1em' }}>
        LOADING…
      </span>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !user.is_admin) return <Navigate to="/topos" replace />

  return children
}

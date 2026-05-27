import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, adminOnly = false }) {
  const { t } = useTranslation()
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span style={{ color: 'var(--muted)', fontFamily: 'Barlow Condensed', fontSize: '1.2rem', letterSpacing: '0.1em' }}>
        {t('common.loading')}
      </span>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />

  return children
}

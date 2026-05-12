import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

const LANGUAGES = { en: 'EN', fr: 'FR' }

const NAV_ITEM_KEYS = [
  { key: 'nav.topos', path: '/topos' },
  { key: 'nav.search', path: '/search' },
  { key: 'nav.stats', path: '/stats' },
  { key: 'nav.upload', path: '/upload' },
  { key: 'nav.map', path: '/map' },
]

const S = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(26,26,24,0.92)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--line)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem',
    height: '52px',
    gap: '0',
  },

  logo: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1.15rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    cursor: 'pointer',
    marginRight: '2rem',
    flexShrink: 0,
    background: 'none',
    border: 'none',
    padding: 0,
    transition: 'color 0.15s',
  },

  logoAccent: {
    color: 'var(--hold)',
  },

  divider: {
    width: '1px',
    height: '20px',
    background: 'var(--line)',
    marginRight: '2rem',
    flexShrink: 0,
  },

  links: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '0',
    flex: 1,
    height: '100%',
  },

  link: (active) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: active ? 'var(--chalk)' : 'var(--muted)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--hold)' : '2px solid transparent',
    padding: '0 1rem',
    transition: 'color 0.15s, border-color 0.15s',
    display: 'flex',
    alignItems: 'center',
  }),

  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexShrink: 0,
  },

  username: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  logoutBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    background: 'none',
    border: '1px solid var(--line)',
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },

  langBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: 'var(--muted)',
    background: 'none',
    border: '1px solid var(--line)',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
}

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  const toggleLang = () => {
    const next = currentLang === 'en' ? 'fr' : 'en'
    localStorage.setItem('lang', next)
    i18n.changeLanguage(next)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Don't render on the login page
  if (location.pathname === '/login') return null

  return (
    <nav style={S.nav}>
      {/* Logo */}
      <button
        style={S.logo}
        onClick={() => navigate('/topos')}
      >
        <span style={S.logoAccent}>Crag</span>Master
      </button>

      <div style={S.divider} />

      {/* Nav links */}
      <div style={S.links}>
        {NAV_ITEM_KEYS.map(item => {
          const active = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              style={S.link(active)}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.color = 'var(--chalk)'
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.color = 'var(--muted)'
              }}
              onClick={() => navigate(item.path)}
            >
              {t(item.key)}
            </button>
          )
        })}
      </div>

      {/* Right side — language toggle + user + logout */}
      <div style={S.right}>
        <button
          style={S.langBtn}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--hold)'
            e.currentTarget.style.color = 'var(--hold)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--line)'
            e.currentTarget.style.color = 'var(--muted)'
          }}
          onClick={toggleLang}
        >
          {LANGUAGES[currentLang === 'en' ? 'en' : 'fr']}
        </button>

        {user && (
          <>
            <button
              style={{ ...S.username, cursor: 'pointer', background: 'none', border: 'none' }}
              onClick={() => navigate('/profile')}
            >
              {user.username}
            </button>
            <button
              style={S.logoutBtn}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--hold)'
                e.currentTarget.style.color = 'var(--hold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--line)'
                e.currentTarget.style.color = 'var(--muted)'
              }}
              onClick={handleLogout}
            >
              {t('nav.signOut')}
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

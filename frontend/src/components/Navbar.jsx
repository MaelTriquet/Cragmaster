import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/client'
import { getPendingCount, onSyncChange, processSyncQueue, getConnectionStatus, isOnline, ping, checkConnection, onConnectionChange } from '../lib/offline'


const NAV_ITEM_KEYS = [
  { key: 'nav.topos', path: '/topos' },
  { key: 'nav.routes', path: '/routes' },
  { key: 'nav.stats', path: '/stats' },
  { key: 'nav.upload', path: '/upload' },
  { key: 'nav.map', path: '/map' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.comingSoon', path: '/coming-soon' },
]

const S = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--granite)',
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
    background: active ? 'rgba(255,255,255,0.06)' : 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--hold)' : '2px solid transparent',
    padding: '0 1rem',
    transition: 'color 0.15s, border-color 0.15s, background 0.15s',
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
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--line)',
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
  },

  notifBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--hold)',
    background: 'rgba(200,80,42,0.1)',
    border: '1px solid var(--hold)',
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },
  notifBtnMuted: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--line)',
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },

  langBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: 'var(--muted)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--line)',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
  },

  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    marginLeft: 'auto',
    flexShrink: 0,
  },

  hamburgerLine: (open) => ({
    width: '20px',
    height: '2px',
    background: 'var(--chalk)',
    transition: 'transform 0.2s, opacity 0.2s',
    ...(open ? {} : {}),
  }),

  drawer: {
    position: 'fixed',
    top: '52px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(26,26,24,0.98)',
    backdropFilter: 'blur(10px)',
    zIndex: 99,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 2rem',
    gap: '0',
    overflowY: 'auto',
  },

  drawerLink: (active) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1.4rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: active ? 'var(--chalk)' : 'var(--muted)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderLeft: active ? '3px solid var(--hold)' : '3px solid transparent',
    padding: '0.85rem 1rem',
    textAlign: 'left',
    transition: 'color 0.15s, border-color 0.15s',
  }),

  drawerSection: {
    borderTop: '1px solid var(--line)',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },

  drawerLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--hold)',
  },

  drawerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
}

function Hamburger({ open, onClick }) {
  const { t } = useTranslation()
  return (
    <button
      style={S.hamburger}
      onClick={onClick}
      aria-label={t('nav.toggleMenu')}
    >
      <div style={{
        ...S.hamburgerLine(open),
        transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
      }} />
      <div style={{
        ...S.hamburgerLine(open),
        opacity: open ? 0 : 1,
      }} />
      <div style={{
        ...S.hamburgerLine(open),
        transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
      }} />
    </button>
  )
}

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [unresolvedCount, setUnresolvedCount] = useState(0)
  const [pendingSyncCount, setPendingSyncCount] = useState(0)
  const [pingState, setPingState] = useState(null) // null | 'checking' | 'online' | 'offline'

  useEffect(() => {
    const s = getConnectionStatus()
    if (s === 0) {
      ping().then(() => {
        setPingState(isOnline() ? 'online' : 'offline')
      })
    } else {
      setPingState(s === 1 ? 'online' : 'offline')
    }
    getPendingCount().then(count => {
      setPendingSyncCount(count)
      if (count > 0 && isOnline()) processSyncQueue().then(r => getPendingCount().then(setPendingSyncCount))
    })
    const unsubSync = onSyncChange(setPendingSyncCount)
    const unsubConn = onConnectionChange(status => {
      setPingState(status === 1 ? 'online' : 'offline')
    })
    return () => { unsubSync(); unsubConn() }
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      ping().then(() => {
        if (isOnline() && pendingSyncCount > 0) processSyncQueue().then(r => getPendingCount().then(setPendingSyncCount))
      })
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [pendingSyncCount])

  useEffect(() => {
    if (user?.is_admin) {
      api.get('/admin/notifications').then(res => {
        setUnresolvedCount((res.data.items || []).filter(i => !i.resolved).length)
      }).catch(() => {})
    }
  }, [user])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const handler = e => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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

  // ── Mobile view ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <nav style={S.nav}>
          {/* Logo */}
          <button style={S.logo} onClick={() => navigate('/')}>
            <span style={S.logoAccent}>Crag</span>Master
          </button>

          {/* Hamburger toggle */}
          <Hamburger open={mobileOpen} onClick={() => setMobileOpen(v => !v)} />
        </nav>

        {/* Drawer */}
        {mobileOpen && (
          <div style={S.drawer}>
            {/* Nav links */}
            {NAV_ITEM_KEYS.map(item => {
              const active = location.pathname.startsWith(item.path)
              return (
                <button
                  key={item.path}
                  style={S.drawerLink(active)}
                  onClick={() => navigate(item.path)}
                >
                  {t(item.key)}
                </button>
              )
            })}

            {/* Lang + user + logout */}
            <div style={S.drawerSection}>
              <div style={S.drawerLabel}>{t('nav.settings')}</div>

              <div style={S.drawerRow}>
                <button
                  style={{
                    ...S.langBtn,
                    fontSize: '0.85rem',
                    padding: '0.45rem 0.9rem',
                  }}
                  onClick={toggleLang}
                >
                  {currentLang === 'en' ? '\ud83c\uddeb\ud83c\uddf7' : '\ud83c\uddec\ud83c\udde7'}
                </button>
              </div>

              <div style={S.drawerRow}>
                <button
                  style={{
                    ...S.langBtn,
                    fontSize: '0.85rem',
                    padding: '0.45rem 0.9rem',
                    gap: '0.45rem',
                    opacity: pingState === 'checking' ? 0.6 : 1,
                  }}
                  disabled={pingState === 'checking'}
                  onClick={async () => {
                    const prev = getConnectionStatus()
                    setPingState('checking')
                    await checkConnection()
                    const cur = getConnectionStatus()
                    setPingState(cur === 1 ? 'online' : 'offline')
                    if (prev !== cur && prev !== 0) window.location.reload()
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: pingState === 'online' ? 'var(--good)' : pingState === 'offline' ? 'var(--hold-lt)' : 'var(--muted)',
                  }} />
                  {pingState === 'checking' ? '…' : t('nav.checkConnection')}
                </button>
              </div>

              {user && (
                <div style={S.drawerRow}>
                  <button
                    style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--chalk)',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                    }}
                    onClick={() => navigate('/profile')}
                  >
                    {user.username}
                  </button>
                </div>
              )}

              {pendingSyncCount > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    style={{
                      flex: 1,
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--good)',
                      background: 'rgba(120,180,80,0.1)',
                      border: '1px solid var(--good)',
                      padding: '0.65rem 1rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                    onClick={() => { if (isOnline()) { processSyncQueue().then(r => getPendingCount().then(setPendingSyncCount)) } }}
                  >
                    {t('nav.syncPending', { count: pendingSyncCount })}
                  </button>
                </div>
              )}

              {user?.is_admin && (
                <button
                  style={{
                    ...(unresolvedCount > 0 ? S.notifBtn : S.notifBtnMuted),
                    fontSize: '0.85rem',
                    padding: '0.65rem 1rem',
                    marginTop: '0.5rem',
                  }}
                  onClick={() => navigate('/admin')}
                >
                  {t('nav.notifications', { count: unresolvedCount })}
                </button>
              )}
              {user && (
                <button
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--hold)',
                    background: 'rgba(200,80,42,0.1)',
                    border: '1px solid var(--hold)',
                    padding: '0.65rem 1rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                  }}
                  onClick={() => navigate('/audit-log')}
                >
                  {user.is_admin ? t('nav.auditLog') : t('nav.myChanges')}
                </button>
              )}
              {user && (
                <button
                  style={{
                    ...S.notifBtn,
                    fontSize: '0.85rem',
                    padding: '0.65rem 1rem',
                    marginTop: '0.5rem',
                  }}
                  onClick={() => navigate('/admin')}
                >
                  {t('nav.notifications', { count: unresolvedCount })}
                </button>
              )}
              {user && (
                <button
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--hold-lt)',
                    background: 'none',
                    border: '1px solid var(--line)',
                    padding: '0.65rem 1rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                  }}
                  onClick={handleLogout}
                >
                  {t('nav.signOut')}
                </button>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // ── Desktop view (unchanged) ────────────────────────────────────────
  return (
    <nav style={S.nav}>
      {/* Logo */}
      <button
        style={S.logo}
        onClick={() => navigate('/')}
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
                if (!active) { e.currentTarget.style.color = 'var(--chalk)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }
              }}
              onMouseLeave={e => {
                if (!active) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'none' }
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
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--line)'
            e.currentTarget.style.color = 'var(--muted)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
          onClick={toggleLang}
        >
          {currentLang === 'en' ? '\ud83c\uddeb\ud83c\uddf7' : '\ud83c\uddec\ud83c\udde7'}
        </button>

        {pendingSyncCount > 0 && (
          <button
            style={{
              ...S.langBtn,
              color: 'var(--good)',
              borderColor: 'var(--good)',
              background: 'rgba(120,180,80,0.1)',
              cursor: isOnline() ? 'pointer' : 'default',
            }}
            onClick={() => { if (isOnline()) { processSyncQueue().then(r => getPendingCount().then(setPendingSyncCount)) } }}
          >
            {t('nav.syncPending', { count: pendingSyncCount })}
          </button>
        )}

        {user?.is_admin && (
          <button
            style={unresolvedCount > 0 ? S.notifBtn : S.notifBtnMuted}
            onMouseEnter={e => {
              if (unresolvedCount > 0) {
                e.currentTarget.style.background = 'rgba(200,80,42,0.2)'
              }
            }}
            onMouseLeave={e => {
              if (unresolvedCount > 0) {
                e.currentTarget.style.background = 'rgba(200,80,42,0.1)'
              }
            }}
            onClick={() => navigate('/admin')}
          >
            {t('nav.notifications', { count: unresolvedCount })}
          </button>
        )}
        {user && (
          <button
            style={{
              ...S.langBtn,
              color: location.pathname === '/audit-log' ? 'var(--chalk)' : 'var(--muted)',
              borderColor: location.pathname === '/audit-log' ? 'var(--hold)' : 'var(--line)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hold)'; e.currentTarget.style.color = 'var(--hold)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={e => { if (location.pathname !== '/audit-log') { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
            onClick={() => navigate('/audit-log')}
          >
            {user.is_admin ? t('nav.auditLog') : t('nav.myChanges')}
          </button>
        )}
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
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--line)'
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
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

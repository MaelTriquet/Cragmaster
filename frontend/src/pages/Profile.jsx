import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/client'

const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    padding: 'var(--page-padding)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  noise: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: '128px',
    pointerEvents: 'none',
    opacity: 0.5,
    zIndex: 0,
  },

  container: {
    width: '100%',
    maxWidth: '560px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  // ── HEADER ──
  header: {
    borderLeft: '4px solid var(--hold)',
    paddingLeft: '1.5rem',
    marginBottom: '0.5rem',
  },

  eyebrow: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'var(--hold)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.4rem',
  },

  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--title-3xl)',
    fontWeight: 800,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: '0',
    lineHeight: 0.95,
  },

  adminBadge: {
    display: 'inline-block',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    background: 'var(--hold)',
    padding: '0.2rem 0.55rem',
    marginTop: '0.75rem',
  },

  // ── CARD ──
  card: {
    background: 'var(--granite)',
    borderLeft: '2px solid var(--line)',
    padding: '1.5rem 1.75rem',
  },

  cardAccent: {
    background: 'var(--granite)',
    borderLeft: '2px solid var(--hold)',
    padding: '1.5rem 1.75rem',
  },

  cardTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--hold)',
    marginBottom: '1.25rem',
  },

  // ── FORM ──
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.25rem',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },

  label: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  input: {
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    color: 'var(--chalk)',
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 400,
    padding: '0.6rem 0.85rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
    boxSizing: 'border-box',
  },

  hint: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.75rem',
    color: 'var(--muted)',
    opacity: 0.7,
    marginTop: '0.1rem',
  },

  // ── BUTTONS ──
  btnPrimary: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0.65rem 1.4rem',
    background: 'var(--hold)',
    color: 'var(--chalk)',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  btnGhost: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0.65rem 1.4rem',
    background: 'transparent',
    color: 'var(--chalk)',
    border: '1px solid var(--line)',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },

  btnRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  // ── FEEDBACK ──
  success: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#7fc99a',
    padding: '0.4rem 0.75rem',
    borderLeft: '2px solid #5a9e6f',
    background: 'rgba(90,158,111,0.08)',
  },

  error: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: 'var(--hold-lt)',
    padding: '0.4rem 0.75rem',
    borderLeft: '2px solid var(--hold)',
    background: 'rgba(200,80,42,0.08)',
  },

  divider: {
    height: '1px',
    background: 'var(--line)',
    margin: '1.25rem 0',
  },

  // ── NEW USER RESULT ──
  newUserResult: {
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    padding: '0.75rem 1rem',
    marginTop: '0.5rem',
  },

  newUserRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  newUserName: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
  },

  newUserMeta: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginTop: '0.2rem',
  },
}

function focusStyle(e) { e.target.style.borderColor = 'var(--hold)' }
function blurStyle(e)  { e.target.style.borderColor = 'var(--line)' }

export default function Profile() {
  const { t } = useTranslation()
  const { user, login } = useAuth()
  const navigate = useNavigate()

  // ── Edit profile state ──
  const [profileForm, setProfileForm] = useState({ username: user?.username ?? '', current_password: '', password: '', confirm: '' })
  const [profileStatus, setProfileStatus] = useState(null) // { type: 'success'|'error', msg }
  const [profileLoading, setProfileLoading] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  // ── Create user state (admin only) ──
  const [createForm, setCreateForm] = useState({ username: '', password: '', is_admin: false })
  const [createStatus, setCreateStatus] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [createdUser, setCreatedUser] = useState(null)

  const handleProfileSave = async () => {
    const { username, current_password, password, confirm } = profileForm
    if (!username.trim()) {
      setProfileStatus({ type: 'error', msg: t('profile.usernameEmpty') }); return
    }
    if (!current_password) {
      setProfileStatus({ type: 'error', msg: t('profile.currentPasswordRequired') }); return
    }
    if (password && password !== confirm) {
      setProfileStatus({ type: 'error', msg: t('profile.passwordsDoNotMatch') }); return
    }
    setProfileLoading(true)
    setProfileStatus(null)
    try {
      const payload = { username: username.trim(), current_password }
      if (password) payload.password = password
      const res = await api.patch('/auth/me', payload)
      setProfileStatus({ type: 'success', msg: t('profile.profileUpdated') })
      setProfileForm(f => ({ ...f, current_password: '', password: '', confirm: '' }))
      // Store new token from server (issued after credential change)
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
      }
      // Re-fetch user context
      if (res.data.user) {
        await login(username.trim(), password || current_password)
      }
    } catch (err) {
      setProfileStatus({ type: 'error', msg: err.response?.data?.error || t('profile.updateFailed') })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleCreateUser = async () => {
    const { username, password, is_admin } = createForm
    if (!username.trim() || !password) {
      setCreateStatus({ type: 'error', msg: t('profile.usernameRequired') }); return
    }
    setCreateLoading(true)
    setCreateStatus(null)
    setCreatedUser(null)
    try {
      const res = await api.post('/users', { username: username.trim(), password, is_admin })
      setCreatedUser(res.data)
      setCreateStatus({ type: 'success', msg: t('profile.userCreated') })
      setCreateForm({ username: '', password: '', is_admin: false })
    } catch (err) {
      setCreateStatus({ type: 'error', msg: err.response?.data?.error || t('profile.creationFailed') })
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{t('profile.eyebrow')}</span>
          <h1 style={S.title}>{user?.username}</h1>
          {user?.is_admin && <div style={S.adminBadge}>{t('profile.admin')}</div>}
        </div>

        {/* ── EDIT PROFILE CARD ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>{t('profile.editProfile')}</div>

          <div style={S.fields}>
            <div style={S.field}>
              <label style={S.label}>{t('profile.username')}</label>
              <input
                style={S.input}
                type="text"
                value={profileForm.username}
                onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            <div style={S.field}>
              <label style={S.label}>{t('profile.currentPassword')}</label>
              <input
                style={S.input}
                type="password"
                placeholder={t('profile.currentPasswordPlaceholder')}
                value={profileForm.current_password}
                onChange={e => setProfileForm(f => ({ ...f, current_password: e.target.value }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            <div style={S.divider} />

            <div style={S.field}>
              <label style={S.label}>{t('profile.newPassword')}</label>
              <input
                style={S.input}
                type="password"
                placeholder={t('profile.newPasswordPlaceholder')}
                value={profileForm.password}
                onChange={e => setProfileForm(f => ({ ...f, password: e.target.value }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            <div style={S.field}>
              <label style={S.label}>{t('profile.confirmPassword')}</label>
              <input
                style={S.input}
                type="password"
                placeholder={t('profile.confirmPasswordPlaceholder')}
                value={profileForm.confirm}
                onChange={e => setProfileForm(f => ({ ...f, confirm: e.target.value }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </div>

          <div style={S.btnRow}>
            <button
              style={{
                ...S.btnPrimary,
                background: profileLoading
                  ? 'var(--muted)'
                  : hoveredBtn === 'save' ? 'var(--hold-lt)' : 'var(--hold)',
                cursor: profileLoading ? 'not-allowed' : 'pointer',
              }}
              disabled={profileLoading}
              onMouseEnter={() => setHoveredBtn('save')}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={handleProfileSave}
            >
              {t(profileLoading ? 'profile.saving' : 'profile.saveChanges')}
            </button>

            {profileStatus && (
              <span style={profileStatus.type === 'success' ? S.success : S.error}>
                {profileStatus.type === 'success' ? '✓ ' : ''}{profileStatus.msg}
              </span>
            )}
          </div>
        </div>

        {/* ── CREATE USER CARD ── */}
        <div style={S.cardAccent}>
          <div style={S.cardTitle}>{t('profile.createUser')}</div>

          <div style={S.fields}>
            <div style={S.field}>
              <label style={S.label}>{t('profile.username')}</label>
              <input
                style={S.input}
                type="text"
                placeholder={t('profile.newUserPlaceholder')}
                value={createForm.username}
                onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            <div style={S.field}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <label style={S.label}>{t('profile.newPassword')}</label>
                <button
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem',
                    border: '1px solid var(--line)',
                    color: 'var(--muted)',
                    background: 'none',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hold)'; e.currentTarget.style.color = 'var(--hold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)' }}
                  onClick={async () => {
                    try {
                      const res = await api.get('/routes/generate-passphrase')
                      if (res.data.passphrase) setCreateForm(f => ({ ...f, password: res.data.passphrase }))
                    } catch {}
                  }}
                >
                  {t('profile.generatePassphrase')}
                </button>
              </div>
              <input
                style={{ ...S.input, color: createForm.password ? 'var(--chalk)' : 'var(--muted)', fontStyle: createForm.password ? 'normal' : 'italic' }}
                type="text"
                readOnly
                placeholder={t('profile.passwordGenerated')}
                value={createForm.password}
              />
            </div>

            {/* Admin toggle — admins only */}
            {user?.is_admin && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => setCreateForm(f => ({ ...f, is_admin: !f.is_admin }))}
              >
                <div style={{
                  width: '36px',
                  height: '20px',
                  background: createForm.is_admin ? 'var(--hold)' : 'var(--line)',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: createForm.is_admin ? '19px' : '3px',
                    width: '14px',
                    height: '14px',
                    background: 'var(--chalk)',
                    transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: createForm.is_admin ? 'var(--chalk)' : 'var(--muted)',
                  transition: 'color 0.15s',
                }}>
                  {t('profile.grantAdmin')}
                </span>
              </div>
            )}
          </div>

            <div style={S.btnRow}>
              <button
                style={{
                  ...S.btnPrimary,
                  background: createLoading
                    ? 'var(--muted)'
                    : hoveredBtn === 'create' ? 'var(--hold-lt)' : 'var(--hold)',
                  cursor: createLoading ? 'not-allowed' : 'pointer',
                }}
                disabled={createLoading}
                onMouseEnter={() => setHoveredBtn('create')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={handleCreateUser}
              >
                {t(createLoading ? 'profile.creating' : 'profile.createUserBtn')}
              </button>

              {createStatus && (
                <span style={createStatus.type === 'success' ? S.success : S.error}>
                  {createStatus.type === 'success' ? '✓ ' : ''}{createStatus.msg}
                </span>
              )}
            </div>

            {/* Created user confirmation */}
            {createdUser && (
              <div style={S.newUserResult}>
                <div style={S.newUserRow}>
                  <div>
                    <div style={S.newUserName}>{createdUser.username}</div>
                    <div style={S.newUserMeta}>
                      ID #{createdUser.id} · {createdUser.is_admin ? t('profile.admin') : t('profile.member')}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#7fc99a',
                  }}>
                    {t('profile.created')}
                  </span>
                </div>
              </div>
            )}
          </div>

      </div>
    </div>
  )
}

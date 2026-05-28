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

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    padding: 'var(--card-padding)',
    background: 'var(--granite)',
    borderLeft: '4px solid var(--hold)',
    marginTop: '12vh',
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
    margin: '0 0 1.5rem 0',
    lineHeight: 0.9,
  },
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
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: 'transparent',
    color: 'var(--muted)',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    marginTop: '1rem',
    transition: 'color 0.15s',
  },
  success: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#7fc99a',
    padding: '0.4rem 0.75rem',
    borderLeft: '2px solid var(--good)',
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
  hint: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    lineHeight: 1.5,
    marginBottom: '1.25rem',
  },
}

function focusStyle(e) { e.target.style.borderColor = 'var(--hold)' }
function blurStyle(e)  { e.target.style.borderColor = 'var(--line)' }

export default function ForgotPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (token) return <ResetPassword token={token} />

  return <ForgotForm />
}

function ForgotForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // { type, msg }
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus({ type: 'error', msg: t('login.emailRequired') })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      await api.post('/auth/forgot-password', { email: email.trim() })
      setSent(true)
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || t('login.sendFailed') })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={S.root}>
        <div style={S.noise} />
        <div style={S.card}>
          <span style={S.eyebrow}>{t('login.eyebrow')}</span>
          <h1 style={S.title}>{t('login.forgotPassword')}</h1>
          <div style={S.hint}>{t('login.emailSent')}</div>
          <button
            style={S.btnGhost}
            onMouseEnter={e => e.target.style.color = 'var(--chalk)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            onClick={() => navigate('/login')}
          >
            &larr; {t('login.backToLogin')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.card}>
        <span style={S.eyebrow}>{t('login.eyebrow')}</span>
        <h1 style={S.title}>{t('login.forgotPassword')}</h1>

        <form onSubmit={handleSubmit}>
          <div style={S.fields}>
            <div style={S.field}>
              <label style={S.label}>{t('login.email')}</label>
              <input
                style={S.input}
                type="email"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                autoFocus
              />
            </div>
          </div>

          {status && (
            <div style={{ ...(status.type === 'error' ? S.error : S.success), marginBottom: '1rem' }}>
              {status.type === 'error' ? '' : '\u2713 '}{status.msg}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...S.btnPrimary,
              background: loading ? 'var(--muted)' : 'var(--hold)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? t('login.sending') : t('login.sendResetLink')}
          </button>
        </form>

        <button
          style={S.btnGhost}
          onMouseEnter={e => e.target.style.color = 'var(--chalk)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          onClick={() => navigate('/login')}
        >
          &larr; {t('login.backToLogin')}
        </button>
      </div>
    </div>
  )
}

function ResetPassword({ token }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    try {
      const res = await api.get('/routes/generate-passphrase')
      if (res.data.passphrase) setPassword(res.data.passphrase)
    } catch {}
  }

  useEffect(() => { generate() }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!password) {
      setStatus({ type: 'error', msg: t('login.passwordRequired') })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
    } catch (err) {
      if (err.response?.status === 400) {
        setStatus({ type: 'error', msg: t('login.invalidResetToken') })
      } else {
        setStatus({ type: 'error', msg: err.response?.data?.error || t('login.resetFailed') })
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div style={S.root}>
        <div style={S.noise} />
        <div style={S.card}>
          <span style={S.eyebrow}>{t('login.eyebrow')}</span>
          <h1 style={S.title}>{t('login.resetPassword')}</h1>
          <div style={S.hint}>{t('login.passwordResetSuccess')}</div>
          <button
            style={S.btnPrimary}
            onMouseEnter={e => e.target.style.background = 'var(--hold-lt)'}
            onMouseLeave={e => e.target.style.background = 'var(--hold)'}
            onClick={() => navigate('/login')}
          >
            {t('login.signIn')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.card}>
        <span style={S.eyebrow}>{t('login.eyebrow')}</span>
        <h1 style={S.title}>{t('login.resetPassword')}</h1>

        <form onSubmit={handleSubmit}>
          <div style={S.fields}>
            <div style={S.field}>
              <label style={S.label}>{t('login.newPassword')}</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  style={{ ...S.input, flex: 1, color: password ? 'var(--chalk)' : 'var(--muted)', fontStyle: password ? 'normal' : 'italic' }}
                  type="text"
                  readOnly
                  value={password || t('profile.passwordGenerated')}
                />
                <button
                  type="button"
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.6rem 0.8rem',
                    border: `1px solid ${copied ? 'var(--good)' : 'var(--line)'}`,
                    color: copied ? '#7fc99a' : 'var(--muted)',
                    background: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onClick={copyToClipboard}
                  onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = 'var(--chalk)'; e.currentTarget.style.color = 'var(--chalk)' }}}
                  onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)' }}}
                >
                  {copied ? t('login.copied') : t('login.copyPassword')}
                </button>
              </div>
              <button
                type="button"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.5rem',
                  border: '1px solid var(--line)',
                  color: 'var(--muted)',
                  background: 'none',
                  cursor: 'pointer',
                  marginTop: '0.3rem',
                  alignSelf: 'flex-start',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onClick={generate}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hold)'; e.currentTarget.style.color = 'var(--hold)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                {t('login.generateNewPassword')}
              </button>
            </div>
          </div>

          {status && (
            <div style={{ ...(status.type === 'error' ? S.error : S.success), marginBottom: '1rem' }}>
              {status.msg}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...S.btnPrimary,
              background: loading ? 'var(--muted)' : 'var(--hold)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading || !password}
          >
            {loading ? t('login.resettingPassword') : t('login.resetPassword')}
          </button>
        </form>
      </div>
    </div>
  )
}

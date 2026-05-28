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
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()
  const { user, loading: authLoading, login } = useAuth()
  const navigate  = useNavigate()

  // If already authenticated (e.g. token restored from storage), skip login
  useEffect(() => {
    if (!authLoading && user) navigate('/', { replace: true })
  }, [user, authLoading, navigate])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password, remember)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || t('login.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.root}>
      {/* Texture overlay */}
      <div style={styles.noise} />

      {/* Decorative vertical rule */}

      <div style={styles.card}>
        {/* Logo / title block */}
        <div style={styles.titleBlock}>
          <span style={styles.eyebrow}>{t('login.eyebrow')}</span>
          <h1 style={styles.title}>{t('login.title')}</h1>
          <div style={styles.titleUnderline} />
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>{t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = 'var(--hold)'}
              onBlur={e  => e.target.style.borderColor = 'var(--line)'}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = 'var(--hold)'}
              onBlur={e  => e.target.style.borderColor = 'var(--line)'}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              userSelect: 'none',
              marginTop: '-0.25rem',
            }}
            onClick={() => setRemember(v => !v)}
          >
            <div style={{
              width: '18px',
              height: '18px',
              flexShrink: 0,
              border: '1px solid var(--line)',
              background: remember ? 'var(--hold)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s',
            }}>
              {remember && (
                <span style={{ color: '#fff', fontSize: '11px', lineHeight: 1, fontWeight: 700 }}>✓</span>
              )}
            </div>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: remember ? 'var(--chalk)' : 'var(--muted)',
              transition: 'color 0.15s',
            }}>
              {t('login.rememberMe')}
            </span>
          </div>

          <button
            type="button"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: '0',
              marginTop: '-0.25rem',
              textAlign: 'left',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--hold)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            onClick={() => navigate('/forgot-password')}
          >
            {t('login.forgotPassword')}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            onMouseEnter={e => { if (!loading) e.target.style.background = 'var(--hold-lt)' }}
            onMouseLeave={e => { if (!loading) e.target.style.background = 'var(--hold)' }}
          >
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>

        <p style={styles.footer}>
          {t('login.footer')}
        </p>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--rock)',
    position: 'relative',
    overflow: 'hidden',
  },
  noise: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: '128px',
    pointerEvents: 'none',
    opacity: 0.6,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    padding: 'var(--card-padding)',
    background: 'var(--granite)',
    borderLeft: '4px solid var(--hold)',
    boxShadow: '0 0 80px rgba(0,0,0,0.6)',
  },
  titleBlock: {
    marginBottom: '2.5rem',
  },
  eyebrow: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'var(--hold)',
    display: 'block',
    marginBottom: '0.5rem',
  },
  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--title-login)',
    fontWeight: 800,
    lineHeight: 0.9,
    letterSpacing: '0.02em',
    color: 'var(--chalk)',
    textTransform: 'uppercase',
    margin: '0 0 1rem 0',
  },
  titleUnderline: {
    width: '2.5rem',
    height: '3px',
    background: 'var(--hold)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: 'var(--muted)',
  },
  input: {
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    color: 'var(--chalk)',
    fontFamily: 'Barlow, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    padding: '0.65rem 0.85rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
  },
  error: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    color: 'var(--hold-lt)',
    margin: 0,
    padding: '0.5rem 0.75rem',
    borderLeft: '2px solid var(--hold)',
  },
  btn: {
    marginTop: '0.5rem',
    background: 'var(--hold)',
    color: 'var(--chalk)',
    border: 'none',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    padding: '0.85rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '2rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    color: 'var(--muted)',
    textAlign: 'right',
    textTransform: 'uppercase',
  },
}

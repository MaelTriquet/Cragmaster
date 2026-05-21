import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/client'

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '1.5rem',
  },
  modal: {
    width: '100%',
    maxWidth: '480px',
    background: 'var(--granite)',
    borderLeft: '4px solid var(--hold)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
  },
  body: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'var(--muted)',
    lineHeight: 1.6,
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
  btnRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  feedback: {
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
}

export default function EmailPrompt() {
  const { t } = useTranslation()
  const { user, refreshUser } = useAuth()
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (!user) return null

  const show = !dismissed && !user.email && !user.email_prompt_dismissed && !saved

  const dismiss = async () => {
    try {
      await api.patch('/auth/me', { email_prompt_dismissed: true })
      await refreshUser()
    } catch {}
    setDismissed(true)
  }

  const saveEmail = async () => {
    if (!email.trim()) return
    setSaving(true)
    try {
      await api.patch('/auth/me', { username: user.username, email: email.trim() })
      await refreshUser()
      setSaved(true)
      setDismissed(true)
    } catch {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.title}>{t('emailPrompt.title')}</div>
        <div style={S.body}>{t('emailPrompt.body')}</div>

        <input
          style={S.input}
          type="email"
          placeholder={t('emailPrompt.emailPlaceholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--hold)'}
          onBlur={e => e.target.style.borderColor = 'var(--line)'}
        />

        <div style={S.btnRow}>
          <button
            style={S.btnPrimary}
            disabled={saving || !email.trim()}
            onClick={saveEmail}
          >
            {saving ? t('emailPrompt.saving') : t('emailPrompt.saveEmail')}
          </button>
          <button
            style={S.btnGhost}
            onClick={dismiss}
          >
            {t('emailPrompt.trustMyself')}
          </button>
        </div>
      </div>
    </div>
  )
}

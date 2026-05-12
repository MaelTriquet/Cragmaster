import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api/client'

const OVERLAY = {
  position: 'fixed', inset: 0, zIndex: 200,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '1rem',
}

const CARD = {
  background: 'var(--rock)',
  border: '1px solid var(--line)',
  padding: '2rem',
  width: '100%',
  maxWidth: '480px',
}

const TITLE = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--chalk)',
  marginBottom: '1.5rem',
}

const LABEL = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  display: 'block',
  marginBottom: '0.3rem',
}

const INPUT = {
  width: '100%',
  background: 'var(--granite)',
  border: '1px solid var(--line)',
  color: 'var(--chalk)',
  fontFamily: 'Barlow, sans-serif',
  fontSize: '0.9rem',
  padding: '0.5rem 0.7rem',
  outline: 'none',
  marginBottom: '1rem',
}

const ROW = {
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
  marginTop: '0.5rem',
}

const BTN = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  background: 'none',
  border: '1px solid var(--line)',
  padding: '0.4rem 1rem',
  color: 'var(--muted)',
  transition: 'border-color 0.15s, color 0.15s',
}

const BTN_PRIMARY = {
  ...BTN,
  background: 'var(--hold)',
  borderColor: 'var(--hold)',
  color: 'var(--chalk)',
}

const ERROR = {
  color: 'var(--hold-lt)',
  fontSize: '0.75rem',
  fontFamily: 'Barlow Condensed, sans-serif',
  marginBottom: '0.75rem',
}

export default function RecommendationModal({ onClose }) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!username.trim()) { setError(t('footer.recUsernameRequired')); return }
    if (!email.trim()) { setError(t('footer.recEmailRequired')); return }
    setSending(true)
    setError('')
    try {
      await api.post('/recommendations', {
        username: username.trim(),
        email: email.trim(),
      })
      setDone(true)
    } catch (e) {
      setError(e.response?.data?.error || t('footer.errorGeneric'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={CARD} onClick={e => e.stopPropagation()}>
        {done ? (
          <>
            <div style={TITLE}>{t('footer.recSubmitted')}</div>
            <div style={ROW}>
              <button style={BTN_PRIMARY} onClick={onClose}>{t('footer.close')}</button>
            </div>
          </>
        ) : (
          <>
            <div style={TITLE}>{t('footer.recommendation')}</div>

            <label style={LABEL}>{t('footer.recUsername')} *</label>
            <input
              style={INPUT}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={t('footer.recUsernamePlaceholder')}
            />

            <label style={LABEL}>{t('footer.recEmail')} *</label>
            <input
              style={INPUT}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('footer.recEmailPlaceholder')}
            />

            {error && <div style={ERROR}>{error}</div>}

            <div style={ROW}>
              <button style={BTN} onClick={onClose}>{t('footer.cancel')}</button>
              <button
                style={BTN_PRIMARY}
                onClick={handleSubmit}
                disabled={sending}
              >
                {sending ? t('footer.sending') : t('footer.send')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

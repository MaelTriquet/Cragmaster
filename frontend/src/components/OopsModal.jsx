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

const TEXTAREA = {
  ...INPUT,
  resize: 'vertical',
  minHeight: '80px',
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

export default function OopsModal({ onClose }) {
  const { t } = useTranslation()
  const [explanation, setExplanation] = useState('')
  const [routeName, setRouteName] = useState('')
  const [topoName, setTopoName] = useState('')
  const [concernedUser, setConcernedUser] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!explanation.trim()) { setError(t('footer.oopsExplanationRequired')); return }
    setSending(true)
    setError('')
    try {
      await api.post('/oops', {
        explanation: explanation.trim(),
        route_name: routeName.trim() || undefined,
        topo_name: topoName.trim() || undefined,
        concerned_user: concernedUser.trim() || undefined,
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
            <div style={TITLE}>{t('footer.oopsSubmitted')}</div>
            <div style={ROW}>
              <button style={BTN_PRIMARY} onClick={onClose}>{t('footer.close')}</button>
            </div>
          </>
        ) : (
          <>
            <div style={TITLE}>{t('footer.oops')}</div>

            <label style={LABEL}>{t('footer.oopsExplanation')} *</label>
            <textarea
              style={TEXTAREA}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder={t('footer.oopsExplanationPlaceholder')}
            />

            <label style={LABEL}>{t('footer.oopsRoute')}</label>
            <input
              style={INPUT}
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              placeholder={t('footer.oopsRoutePlaceholder')}
            />

            <label style={LABEL}>{t('footer.oopsTopo')}</label>
            <input
              style={INPUT}
              value={topoName}
              onChange={e => setTopoName(e.target.value)}
              placeholder={t('footer.oopsTopoPlaceholder')}
            />

            <label style={LABEL}>{t('footer.oopsUser')}</label>
            <input
              style={INPUT}
              value={concernedUser}
              onChange={e => setConcernedUser(e.target.value)}
              placeholder={t('footer.oopsUserPlaceholder')}
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

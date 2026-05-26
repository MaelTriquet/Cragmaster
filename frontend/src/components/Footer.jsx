import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotifyModal from './NotifyModal'

const S = {
  footer: {
    borderTop: '1px solid var(--line)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    background: '#121210',
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  label: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.55rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginRight: '0.2rem',
    opacity: 0.5,
  },
  btn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--footer-btn-font, 0.7rem)',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    cursor: 'pointer',
    background: 'none',
    border: '1px solid var(--line)',
    padding: 'var(--footer-btn-padding, 0.3rem 0.75rem)',
    transition: 'border-color 0.15s, color 0.15s',
  },
}

export default function Footer() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showNotify, setShowNotify] = useState(false)

  return (
    <>
      <footer style={S.footer}>
        <div style={S.group}>
          <span style={S.label}>{t('footer.helpLabel')}</span>
          <button
            style={S.btn}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hold)'; e.currentTarget.style.color = 'var(--hold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)' }}
            onClick={() => navigate('/faq')}
          >
            FAQ
          </button>
        </div>

        <div style={S.group}>
          <span style={S.label}>{t('footer.feedbackLabel')}</span>
          <button
            style={S.btn}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hold)'; e.currentTarget.style.color = 'var(--hold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)' }}
            onClick={() => setShowNotify(true)}
          >
            {t('footer.notify')}
          </button>
        </div>
      </footer>

      {showNotify && <NotifyModal onClose={() => setShowNotify(false)} />}
    </>
  )
}

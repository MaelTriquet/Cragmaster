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
    background: 'var(--granite)',
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  label: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginRight: '0.35rem',
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

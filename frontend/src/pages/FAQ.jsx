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

import { useTranslation } from 'react-i18next'

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
    maxWidth: '640px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    marginBottom: '2.5rem',
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
    margin: '0 0 1rem 0',
    lineHeight: 0.95,
  },
  titleUnderline: {
    width: '2.5rem',
    height: '3px',
    background: 'var(--hold)',
  },
  section: {
    borderLeft: '2px solid var(--line)',
    padding: '1.5rem 1.75rem',
    marginBottom: '1.5rem',
    background: 'var(--granite)',
  },
  q: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    marginBottom: '0.6rem',
  },
  a: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'var(--chalk)',
    lineHeight: 1.65,
    margin: 0,
  },
}

export default function FAQ() {
  const { t } = useTranslation()

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>
        <div style={S.header}>
          <span style={S.eyebrow}>{t('faq.eyebrow')}</span>
          <h1 style={S.title}>{t('faq.title')}</h1>
          <div style={S.titleUnderline} />
        </div>

        <div style={S.section}>
          <div style={S.q}>{t('faq.q1')}</div>
          <p style={S.a}>{t('faq.a1')}</p>
        </div>
      </div>
    </div>
  )
}

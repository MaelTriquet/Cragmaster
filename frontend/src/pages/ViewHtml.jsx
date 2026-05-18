import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
    maxWidth: '900px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    marginBottom: '1.75rem',
    transition: 'color 0.15s',
  },

  header: {
    borderLeft: '4px solid var(--hold)',
    paddingLeft: '1.5rem',
    marginBottom: '1.5rem',
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
    margin: '0 0 0.5rem 0',
    lineHeight: 0.95,
  },

  metaRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },

  metaItem: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  contentHost: {
    width: '100%',
  },

  loading: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    textAlign: 'center',
    padding: '4rem 0',
  },
}

export default function ViewHtml() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const hostRef = useRef(null)
  const [topo, setTopo] = useState(null)
  const [html, setHtml] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.get(`/topos/${id}`),
      api.get(`/topos/${id}/html`, { responseType: 'text' }),
    ]).then(([topoRes, htmlRes]) => {
      if (cancelled) return
      setTopo(topoRes.data.topo)
      setHtml(htmlRes.data)
      setLoading(false)
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!hostRef.current || !html) return
    const root = hostRef.current.shadowRoot || hostRef.current.attachShadow({ mode: 'open' })
    root.innerHTML = html
  }, [html])

  if (loading) {
    return (
      <div style={S.root}>
        <div style={S.noise} />
        <div style={{ ...S.container, alignItems: 'center', justifyContent: 'center' }}>
          <p style={S.loading}>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!topo || !html) {
    return (
      <div style={S.root}>
        <div style={S.noise} />
        <div style={{ ...S.container, alignItems: 'center', justifyContent: 'center' }}>
          <p style={S.loading}>Topo not found</p>
        </div>
      </div>
    )
  }

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.container}>
        <button
          style={S.backBtn}
          onClick={() => navigate(`/topos/${id}`)}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--chalk)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
        >
          ← {t('topoDetail.back')}
        </button>

        <div style={S.header}>
          <span style={S.eyebrow}>{t('topos.eyebrow')}</span>
          <h1 style={S.title}>{topo.title}</h1>
          <div style={S.metaRow}>
            <span style={S.metaItem}>theCrag.com</span>
          </div>
        </div>

        <div ref={hostRef} style={S.contentHost} />
      </div>
    </div>
  )
}

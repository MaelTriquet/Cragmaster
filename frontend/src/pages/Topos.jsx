import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import api from '../api/client'
import { getOfflineTopoIds, getOfflineTopo, getConnectionStatus, isOnline, ping } from '../lib/offline'

const S = {
  root: {
    minHeight: "100vh",
    background: "var(--rock)",
    padding: "var(--page-padding)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  noise: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: "128px",
    pointerEvents: "none",
    opacity: 0.5,
    zIndex: 0,
  },

  container: {
    width: "100%",
    maxWidth: "620px",
    position: "relative",
    zIndex: 1,
  },

  // ── HEADER ──
  header: {
    marginBottom: "2.5rem",
  },

  eyebrow: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    color: "var(--hold)",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "0.4rem",
  },

  title: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "var(--title-4xl)",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: "0 0 1rem 0",
    lineHeight: 0.9,
  },

  titleUnderline: {
    width: "2.5rem",
    height: "3px",
    background: "var(--hold)",
  },

  // ── TOOLBAR ──
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    gap: "1rem",
  },

  countPill: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
  },

  uploadBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.5rem 1.1rem",
    cursor: "pointer",
    background: "var(--hold)",
    color: "var(--chalk)",
    border: "none",
    transition: "background 0.15s",
  },

  // ── LIST ──
  list: {
    display: "flex",
    flexDirection: "column",
  },

  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 0",
    borderBottom: "1px solid var(--line)",
    cursor: "pointer",
    gap: "1rem",
    transition: "background 0.1s",
  },

  itemLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    flex: 1,
  },

  itemTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.15rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    transition: "color 0.15s",
  },

  itemTitleHover: {
    color: "var(--hold-lt)",
  },

  itemLocation: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.82rem",
    fontWeight: 300,
    color: "var(--muted)",
  },

  itemArrow: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.1rem",
    color: "var(--line)",
    flexShrink: 0,
    transition: "color 0.15s, transform 0.15s",
  },

  itemArrowHover: {
    color: "var(--hold)",
    transform: "translateX(3px)",
  },

  // ── STATES ──
  stateText: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)",
    padding: "2rem 0",
  },
}

export default function Topos() {
  const [topos, setTopos] = useState([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (getConnectionStatus() === 0) await ping()
      if (!isOnline()) {
        const ids = await getOfflineTopoIds()
        if (ids.length > 0) {
          const cached = []
          for (const id of ids) {
            const data = await getOfflineTopo(id)
            if (data?.topo) cached.push(data.topo)
          }
          cached.sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          )
          setTopos(cached)
          setOfflineMode(true)
        }
        setLoading(false)
        return
      }

      try {
        const res = await api.get("/topos")
        const list = res.data || []
        list.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        )
        setTopos(list)
        setOfflineMode(false)
      } catch {
        const ids = await getOfflineTopoIds()
        if (ids.length > 0) {
          const cached = []
          for (const id of ids) {
            const data = await getOfflineTopo(id)
            if (data?.topo) cached.push(data.topo)
          }
          cached.sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          )
          setTopos(cached)
          setOfflineMode(true)
        }
      }
      setLoading(false)
    })()
  }, [])

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{t('topos.eyebrow')}</span>
          <h1 style={S.title}>{t('topos.title')}</h1>
          <div style={S.titleUnderline} />
        </div>

        {/* ── TOOLBAR ── */}
        <div style={S.toolbar}>
          <span style={S.countPill}>
            {loading ? "—" : (topos.length < 2 ? t('topos.count', { count: topos.length }) : t('topos.count_plural', { count: topos.length }))}
          </span>
          <button
            style={{
              ...S.uploadBtn,
              background: hovered === "upload" ? "var(--hold-lt)" : "var(--hold)",
            }}
            onMouseEnter={() => setHovered("upload")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/upload")}
          >
            {t('topos.upload')}
          </button>
        </div>

        {offlineMode && (
          <div style={{
            textAlign: 'center',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--good)',
            border: '1px solid var(--good)',
            background: 'rgba(120,180,80,0.08)',
          }}>
            {t('topos.offlineBanner')}
          </div>
        )}

        {/* ── LIST ── */}
        <div style={S.list}>
          {loading ? (
            <p style={S.stateText}>{t('topos.loading')}</p>
          ) : topos.length === 0 ? (
            <p style={S.stateText}>{t('topos.empty')}</p>
          ) : (
            topos.map((topo, i) => (
              <div
                key={topo.id}
                style={{
                  ...S.item,
                  borderTop: i === 0 ? "1px solid var(--line)" : "none",
                  background: hovered === topo.id
                    ? "rgba(255,255,255,0.02)"
                    : "transparent",
                }}
                onMouseEnter={() => setHovered(topo.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate("/topos/" + topo.id)}
              >
                <div style={S.itemLeft}>
                  <span style={{
                    ...S.itemTitle,
                    ...(hovered === topo.id ? S.itemTitleHover : {}),
                  }}>
                    {topo.title}
                  </span>
                  {topo.location && (
                    <span style={S.itemLocation}>{topo.location}</span>
                  )}
                </div>

                <span style={{
                  ...S.itemArrow,
                  ...(hovered === topo.id ? S.itemArrowHover : {}),
                }}>
                  ›
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

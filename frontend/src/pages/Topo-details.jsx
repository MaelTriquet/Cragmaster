import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import api from '../api/client'
import axios from 'axios'
import { saveTopoForOffline, getOfflineTopo, isOnline } from '../lib/offline'
import { loadLeaflet } from '../lib/leaflet'
import { useToast } from '../contexts/ToastContext'

const getGradeColor = (grade) => {
  if (grade < 0) return 'hsl(0, 0%, 50%)'
  // Keyframe stops: [sorting_grade_index, hue, saturation%, lightness%]
const stops = [
  [0,  105, 55, 48],  // 3a  — muted green
  [11.5, 88,  60, 46],  // between 4c+ and 5a
  [17.5, 65,  70, 46],  // between 5c+ and 6a
  [19.5, 45,  75, 48],  // between 6a+ and 6b
  [21.5, 30,  78, 46],  // between 6b+ and 6c
  [23.5, 18,  80, 45],  // between 6c+ and 7a
  [25.5, 6,   82, 44],  // between 7a+ and 7b
  [27.5, 352, 80, 42],  // between 7b+ and 7c
  [29.5, 330, 75, 38],  // between 7c+ and 8a
  [35,   285, 70, 32],  // 8b+ — dark purple
]
  // Clamp to range
  if (grade <= stops[0][0]) {
    return `hsl(${stops[0][1]}, ${stops[0][2]}%, ${stops[0][3]}%)`
  }
  if (grade >= stops[stops.length - 1][0]) {
    const s = stops[stops.length - 1]
    return `hsl(${s[1]}, ${s[2]}%, ${s[3]}%)`
  }

  // Find surrounding stops and interpolate
  let lo, hi
  for (let i = 0; i < stops.length - 1; i++) {
    if (grade >= stops[i][0] && grade <= stops[i + 1][0]) {
      lo = stops[i]
      hi = stops[i + 1]
      break
    }
  }

  const t = (grade - lo[0]) / (hi[0] - lo[0])
  // Interpolate hue the short way around the color wheel
  let dh = hi[1] - lo[1]
  if (dh > 180)  dh -= 360
  if (dh < -180) dh += 360
  const h = lo[1] + dh * t
  const s = lo[2] + (hi[2] - lo[2]) * t
  const l = lo[3] + (hi[3] - lo[3]) * t

  return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`
}

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
    maxWidth: "800px",
    position: "relative",
    zIndex: 1,
  },

  // ── BACK ──
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "0",
    marginBottom: "1.75rem",
    transition: "color 0.15s",
  },

  // ── HEADER ──
  header: {
    borderLeft: "4px solid var(--hold)",
    paddingLeft: "1.5rem",
    marginBottom: "2rem",
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
    fontSize: "var(--title-3xl)",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: "0 0 0.5rem 0",
    lineHeight: 0.95,
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginTop: "0.75rem",
  },

  metaText: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    color: "var(--muted)",
  },

  routeCount: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--line)",
    padding: "0.2rem 0.6rem",
  },

  // ── TOOLBAR ──
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.75rem",
    gap: "1rem",
    flexWrap: "wrap",
  },

  toggleGroup: {
    display: "flex",
    border: "1px solid var(--line)",
    overflow: "hidden",
  },

  toggleBtn: (active) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.5rem 1.1rem",
    cursor: "pointer",
    border: "none",
    background: active ? "var(--hold)" : "transparent",
    color: active ? "var(--chalk)" : "var(--muted)",
    transition: "background 0.15s, color 0.15s",
    borderRight: "1px solid var(--line)",
  }),

  downloadBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.5rem 1.1rem",
    cursor: "pointer",
    background: "transparent",
    color: "var(--muted)",
    border: "1px solid var(--line)",
    transition: "border-color 0.15s, color 0.15s",
  },

  // ── HISTOGRAM ──
  histogramSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },

  histogramRow: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    cursor: "pointer",
    padding: "0.5rem 0",
    borderBottom: "1px solid var(--line)",
    transition: "background 0.1s",
  },

  gradeLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--chalk)",
    width: "52px",
    flexShrink: 0,
  },

  barTrack: {
    flex: 1,
    height: "8px",
    background: "rgba(255,255,255,0.04)",
    position: "relative",
    marginRight: "0.75rem",
  },

  bar: (width, color) => ({
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: `${width}%`,
    background: color,
    transition: "width 0.3s ease",
  }),

  countLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "var(--muted)",
    width: "28px",
    textAlign: "right",
    flexShrink: 0,
  },

  chevron: (expanded) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    color: "var(--muted)",
    marginLeft: "0.75rem",
    transition: "transform 0.2s",
    transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
    display: "inline-block",
    width: "14px",
    flexShrink: 0,
  }),

  // ── EXPANDED ROUTES ──
  routeDrawer: {
    background: "var(--granite)",
    borderBottom: "1px solid var(--line)",
    padding: "0.5rem 0 0.75rem 52px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },

  routeRow: {
    display: "flex",
    alignItems: "center",
    padding: "0.45rem 0.75rem 0.45rem 0",
    cursor: "pointer",
    gap: "0.75rem",
    transition: "background 0.1s",
  },

  routeName: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 400,
    color: "var(--chalk)",
    flex: 1,
    transition: "color 0.15s",
  },

  routeNameHover: {
    color: "var(--hold-lt)",
  },

  routeLength: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "var(--muted)",
  },

  routeArrow: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    color: "var(--line)",
    transition: "color 0.15s",
  },

  // ── INDEX VIEW ──
  indexList: {
    display: "flex",
    flexDirection: "column",
  },

  indexRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.65rem 0",
    borderBottom: "1px solid var(--line)",
    cursor: "pointer",
    transition: "background 0.1s",
  },

  indexNum: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--muted)",
    width: "36px",
    flexShrink: 0,
    textAlign: "right",
  },

  indexName: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    color: "var(--chalk)",
    flex: 1,
    transition: "color 0.15s",
  },

  indexGrade: (color) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--chalk)",
    background: color,
    padding: "0.15rem 0.5rem",
    flexShrink: 0,
  }),

  // ── ADD ROUTE FORM ────────────────────────────────────────────────────────────────────
   btnRow: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.25rem",
    flexWrap: "wrap",
  },

  btnGhost: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.6rem 1.2rem",
    background: "transparent",
    color: "var(--chalk)",
    border: "1px solid var(--line)",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },

  card: {
    background: "var(--granite)",
    borderLeft: "2px solid var(--line)",
    padding: "1.5rem 1.75rem",
    marginBottom: "1.5rem",
  },

  cardTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--hold)",
    marginBottom: "1.25rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "var(--grid-2col, 1fr 1fr)",
    gap: "0.85rem",
    marginBottom: "0.85rem",
  },

  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },

  formFieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    gridColumn: "1 / -1",
  },

  formLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
  },

  formInput: {
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.95rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },

  formTextarea: {
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.95rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "90px",
  },

  divider: {
    height: "1px",
    background: "var(--line)",
    margin: "1.25rem 0",
  },


  btnPrimary: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.6rem 1.2rem",
    background: "var(--hold)",
    color: "var(--chalk)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s",
  },

  // ── MODAL ──
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "1rem",
  },

  modal: {
    background: "var(--granite)",
    borderLeft: "4px solid var(--hold)",
    padding: "2rem 2rem 1.75rem",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 8px 48px rgba(0,0,0,0.6)",
  },

  modalTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.2rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: "0 0 0.75rem",
  },

  modalBody: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 300,
    color: "var(--muted)",
    lineHeight: 1.6,
    margin: "0 0 0.5rem",
  },

  modalHint: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "var(--hold)",
    lineHeight: 1.5,
    margin: "0 0 1.5rem",
    padding: "0.6rem 0.85rem",
    border: "1px solid var(--line)",
    background: "rgba(200,80,42,0.06)",
  },

  modalActions: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  modalCancel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted)",
    cursor: "pointer",
    background: "none",
    border: "1px solid var(--line)",
    padding: "0.55rem 1rem",
    flex: 1,
    minWidth: "120px",
    transition: "border-color 0.15s, color 0.15s",
  },
}

const TOPO_TAG_CATEGORIES = ['approach', 'exposure']
const ROUTE_TAG_CATEGORIES = ['route_style', 'hold', 'style']
const CATEGORY_COLORS = {
  route_style: 'hsl(200, 60%, 50%)',
  hold:        'hsl(140, 50%, 45%)',
  style:       'hsl(350, 60%, 50%)',
}

// ── Topo tag management panel (approach + exposure only) ─────────────────────────
function TopoTagManager({ topoId, tags, onTagsChange }) {
  const [allTags, setAllTags] = useState([])
  const [showPicker, setShowPicker] = useState(false)
  const [hovered, setHovered] = useState(null)
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()

  const tagName = (tag) => (i18n.language === 'fr' && tag.name_fr ? tag.name_fr : tag.name)

  useEffect(() => {
    api.get("/tags").then(res => setAllTags(res.data.tags || [])).catch(() => {})
  }, [])

  const allByCategory = {}
  for (const tag of allTags) {
    const cat = tag.category || 'other'
    if (!allByCategory[cat]) allByCategory[cat] = []
    allByCategory[cat].push(tag)
  }

  const assignedByCategory = {}
  for (const tag of tags) {
    const cat = tag.category || 'other'
    if (!assignedByCategory[cat]) assignedByCategory[cat] = []
    assignedByCategory[cat].push(tag)
  }
  const assignedIds = new Set(tags.map(t => t.id))

  const handleAssign = async (tagId) => {
    if (assignedIds.has(tagId)) return
    if (!isOnline()) { showToast(t('topoDetail.offlineMessage')); return }
    const res = await api.post(`/topos/${topoId}/tags`, { tag_id: tagId })
    onTagsChange(res.data.tags)
  }

  const handleRemove = async (tagId) => {
    if (!isOnline()) { showToast(t('topoDetail.offlineMessage')); return }
    const res = await api.delete(`/topos/${topoId}/tags/${tagId}`)
    onTagsChange(res.data.tags)
  }

  const tagS = {
    section: {
      marginTop: "1.5rem",
      borderTop: "1px solid var(--line)",
      paddingTop: "1.25rem",
    },
    title: {
      fontFamily: "Barlow Condensed, sans-serif",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)",
      marginBottom: "1rem",
    },
    categoryRow: {
      display: "flex",
      alignItems: "baseline",
      gap: "0.5rem",
      padding: "0.3rem 0",
      borderBottom: "1px solid rgba(255,255,255,0.03)",
    },
    categoryLabel: {
      fontFamily: "Barlow Condensed, sans-serif",
      fontSize: "0.68rem",
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "var(--hold)",
      minWidth: "6.5rem",
      flexShrink: 0,
    },
    categoryTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.3rem",
      alignItems: "center",
      flex: 1,
    },
    tagChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      fontFamily: "Barlow Condensed, sans-serif",
      fontSize: "0.7rem",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "0.1rem 0.45rem",
      border: "1px solid var(--line)",
      color: "var(--chalk)",
      background: "rgba(255,255,255,0.04)",
    },
    tagRemoveChip: {
      background: "none",
      border: "none",
      color: "var(--muted)",
      cursor: "pointer",
      fontSize: "0.65rem",
      padding: "0",
      lineHeight: 1,
      display: "inline-flex",
      transition: "color 0.15s",
    },
    noTagText: {
      fontFamily: "Barlow, sans-serif",
      fontSize: "0.8rem",
      fontStyle: "italic",
      color: "var(--line)",
    },
    addTagBtn: {
      fontFamily: "Barlow Condensed, sans-serif",
      fontSize: "0.78rem",
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      padding: "0.55rem 1.2rem",
      border: "1px dashed var(--line)",
      color: "var(--muted)",
      background: "none",
      cursor: "pointer",
      width: "100%",
      marginTop: "0.75rem",
      transition: "border-color 0.15s, color 0.15s",
    },
  }

  return (
    <div style={tagS.section}>
      <div style={tagS.title}>{t('tags.title')}</div>
      {TOPO_TAG_CATEGORIES.map(cat => {
        const assigned = assignedByCategory[cat] || []
        return (
          <div key={cat} style={tagS.categoryRow}>
            <span style={tagS.categoryLabel}>{t(`tags.category_${cat}`)}</span>
            <div style={tagS.categoryTags}>
              {assigned.length > 0 ? assigned.map(tg => (
                <span key={tg.id} style={tagS.tagChip}>
                  {tagName(tg)}
                  <button
                    style={{
                      ...tagS.tagRemoveChip,
                      color: hovered === `rm-${tg.id}` ? "var(--hold-lt)" : "var(--muted)",
                    }}
                    onMouseEnter={() => setHovered(`rm-${tg.id}`)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleRemove(tg.id)}
                  >
                    ✕
                  </button>
                </span>
              )) : (
                <span style={tagS.noTagText}>{t('tags.noTag')}</span>
              )}
            </div>
          </div>
        )
      })}

      <button
        style={{
          ...tagS.addTagBtn,
          borderColor: showPicker ? "var(--hold)" : "var(--line)",
          color: showPicker ? "var(--hold)" : "var(--muted)",
        }}
        onMouseEnter={() => setHovered("addTags")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setShowPicker(true)}
      >
        + {t('tags.addTag')}
      </button>

      {showPicker && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }} onClick={() => setShowPicker(false)}>
          <div style={{
            background: 'var(--granite)',
            border: '1px solid var(--line)',
            width: '100%', maxWidth: '520px',
            maxHeight: '80vh',
            display: 'flex', flexDirection: 'column',
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem', borderBottom: '1px solid var(--line)',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '1.1rem', fontWeight: 700, color: 'var(--chalk)',
              }}>
                {t('tags.title')}
              </span>
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: '1.2rem', padding: '0.25rem',
                  lineHeight: 1,
                }}
                onMouseEnter={e => e.target.style.color = 'var(--chalk)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                onClick={() => setShowPicker(false)}
              >
                ✕
              </button>
            </div>

            <div style={{
              flex: 1, overflow: 'auto', padding: '1.25rem',
            }}>
              {TOPO_TAG_CATEGORIES.map(cat => {
                const available = allByCategory[cat] || []
                if (available.length === 0) return null
                return (
                  <div key={cat} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--hold)', marginBottom: '0.4rem',
                    }}>
                      {t(`tags.category_${cat}`)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {available.map(tg => {
                        const as = assignedIds.has(tg.id)
                        return (
                          <button
                            key={tg.id}
                            style={{
                              fontFamily: 'Barlow Condensed, sans-serif',
                              fontSize: '0.68rem', fontWeight: 600,
                              letterSpacing: '0.05em', textTransform: 'uppercase',
                              padding: '0.3rem 0.6rem', borderRadius: '3px',
                              cursor: as ? 'default' : 'pointer', border: '1px solid',
                              background: as ? 'var(--hold)' : 'transparent',
                              borderColor: as ? 'var(--hold)' : 'var(--line)',
                              color: as ? '#fff' : hovered === `pick-${tg.id}` ? 'var(--chalk)' : 'var(--muted)',
                            }}
                            onMouseEnter={() => !as && setHovered(`pick-${tg.id}`)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => !as && handleAssign(tg.id)}
                          >
                            {tagName(tg)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              {allTags.length === 0 && (
                <div style={{
                  fontFamily: 'Barlow, sans-serif', fontSize: '0.8rem',
                  color: 'var(--muted)', fontStyle: 'italic',
                }}>
                  {t('tags.loading')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Static minimap (500m x 500m OSM square centered on routes) ─────────────────
function MiniMap({ lat, lon }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let cancelled = false

    loadLeaflet().then(L => {
      if (cancelled || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        center: [lat, lon],
        zoom: 18,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
        boxZoom: false,
      })

      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Style: &copy; OpenTopoMap',
        maxZoom: 17,
        subdomains: 'abc',
      }).addTo(map)

      L.circleMarker([lat, lon], {
        radius: 6,
        color: '#c8502a',
        fillColor: '#c8502a',
        fillOpacity: 0.8,
        weight: 2,
      }).addTo(map)

      mapRef.current = map
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lon])

  return (
    <div
      ref={containerRef}
      style={{
        width: "200px",
        height: "200px",
        borderRadius: "4px",
        border: "1px solid var(--line)",
        overflow: "hidden",
        maxWidth: "100%",
      }}
    />
  )
}

// ── Route tag style breakdown graph ──────────────────────────────────────────────
function RouteTagBreakdown({ stats, t, tagName }) {
  if (!stats || stats.length === 0) return null

  const byCategory = {}
  for (const d of stats) {
    const cat = d.category
    if (!ROUTE_TAG_CATEGORIES.includes(cat)) continue
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(d)
  }

  const catsWithData = ROUTE_TAG_CATEGORIES.filter(c => byCategory[c]?.length > 0)
  if (catsWithData.length === 0) return null

  return (
    <div style={{
      marginTop: "1.5rem",
      borderTop: "1px solid var(--line)",
      paddingTop: "1.25rem",
    }}>
      <div style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: "1rem",
      }}>
        {t('topoDetail.routeStyleBreakdown')}
      </div>

      {catsWithData.map(cat => {
        const items = byCategory[cat]
        const max = Math.max(...items.map(i => i.count), 1)
        const color = CATEGORY_COLORS[cat] || 'var(--muted)'
        return (
          <div key={cat} style={{ marginBottom: "1rem" }}>
            <div style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color,
              marginBottom: "0.4rem",
            }}>
              {t(`tags.category_${cat}`)}
            </div>
            {items.map(d => {
              const pct = (d.count / max) * 100
              return (
                <div key={d.name} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.2rem 0",
                }}>
                  <span style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "var(--chalk)",
                    width: "5.5rem",
                    flexShrink: 0,
                    textAlign: "right",
                  }}>
                    {tagName(d)}
                  </span>
                  <div style={{
                    flex: 1,
                    height: "10px",
                    background: "rgba(255,255,255,0.04)",
                    position: "relative",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${Math.max(pct, 2)}%`,
                      background: color,
                      opacity: 0.7,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                  <span style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "var(--muted)",
                    width: "1.5rem",
                    textAlign: "right",
                  }}>
                    {d.count}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function TopoDetail() {
  const { t, i18n } = useTranslation()
  const tagName = (tag) => (i18n.language === 'fr' && tag.name_fr ? tag.name_fr : tag.name)
  const { id } = useParams()
  const navigate = useNavigate()

  const [topo, setTopo] = useState(null)
  const [routes, setRoutes] = useState([])
  const [tags, setTags] = useState([])
  const [routeTagStats, setRouteTagStats] = useState([])
  const [parkingLocation, setParkingLocation] = useState(null)
  const [routesLocation, setRoutesLocation] = useState(null)
  const [view, setView] = useState("grades")
  const [expandedGrades, setExpandedGrades] = useState({})
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [hoveredRoute, setHoveredRoute] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [downloadErr, setDownloadErr] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')

  const [addForm, setAddForm] = useState({
    name: "",
    grade: "",
    length: "",
    route_index: "",
  })

  const [confirmModal, setConfirmModal] = useState(null)
  const [savingOffline, setSavingOffline] = useState(false)
  const [offlineSaved, setOfflineSaved] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/topos/${id}`)
        setTopo(res.data.topo)
        setRoutes(res.data.routes)
        setTags(res.data.tags || [])
        setRouteTagStats(res.data.route_tag_stats || [])
        setParkingLocation(res.data.parking_location)
        setRoutesLocation(res.data.routes_location)
      } catch {
        const cached = await getOfflineTopo(id)
        if (cached) {
          setTopo(cached.topo)
          setRoutes(cached.routes)
          setTags(cached.tags || [])
          setRouteTagStats(cached.route_tag_stats || [])
          setParkingLocation(cached.parking_location)
          setRoutesLocation(cached.routes_location)
        }
      }
    })()
  }, [id])

  useEffect(() => {
    if (!topo?.filename || topo.filename.startsWith('http')) return
    ;(async () => {
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem')
        await Filesystem.stat({
          path: 'CragMaster/' + (topo.filename || 'topo.pdf'),
          directory: Directory.Documents,
        })
        setDownloaded(true)
      } catch {}
    })()
  }, [topo])

  const submitRouteAdd = () => {
    if (!isOnline()) { showToast(t('topoDetail.offlineMessage')); return }
    api.post(`/topos/${id}/add_route`, addForm)
      .then(res => {
        setRoutes(res.data.routes)
        setShowAddForm(false)
        setAddForm({ name: "", grade: "", length: "", route_index: "" })
      })
  }

  const handleSaveOffline = async () => {
    if (!isOnline()) { showToast(t('topoDetail.offlineMessage')); return }
    setSavingOffline(true)
    setOfflineSaved(false)
    try {
      await saveTopoForOffline(id)
      setOfflineSaved(true)
      setTimeout(() => setOfflineSaved(false), 3000)
    } catch {
      showToast(t('topoDetail.downloadFailed'))
    } finally {
      setSavingOffline(false)
    }
  }

  if (!topo) return (
    <div style={{ ...S.root, justifyContent: "center" }}>
      <span style={{ fontFamily: "Barlow Condensed", fontSize: "1.2rem", letterSpacing: "0.1em", color: "var(--muted)" }}>
        {t('topoDetail.loading')}
      </span>
    </div>
  )

  const gradesMap = routes.reduce((acc, r) => {
    if (!acc[r.grade]) acc[r.grade] = []
    acc[r.grade].push(r)
    return acc
  }, {})

  // Sort grades by sorting_grade value for proper climbing grade order
  const grades = Object.keys(gradesMap).sort((a, b) => {
    const sa = gradesMap[a][0].sorting_grade
    const sb = gradesMap[b][0].sorting_grade
    return sa - sb
  })

  const maxCount = Math.max(...grades.map(g => gradesMap[g].length), 1)

  const toggleGrade = (g) => {
    setExpandedGrades(prev => ({ ...prev, [g]: !prev[g] }))
  }

  const doGeoLocation = (type) => {
    if (!isOnline()) { showToast(t('topoDetail.offlineMessage')); return }
    if (!navigator.geolocation) {
      alert(t('topoDetail.geoNotSupported'));
      return;
    }

    const endpoint = type === 'parking'
      ? `/topos/${id}/set_location_parking`
      : `/topos/${id}/set_location_routes`
    const setter = type === 'parking' ? setParkingLocation : setRoutesLocation

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          await api.post(endpoint, { lat: latitude, lon: longitude });
          setter({ lat: latitude, lon: longitude });
        } catch (error) {
          console.error("Error sending location:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(t('topoDetail.geoFailed'));
      }
    );
  };

  const handleSetParking = () => setConfirmModal('parking')
  const handleSetRoutes = () => setConfirmModal('routes')

  const confirmAndSend = () => {
    if (!confirmModal) return
    doGeoLocation(confirmModal)
    setConfirmModal(null)
  }

  const handleSetOnMap = () => {
    setConfirmModal(null)
    navigate('/map')
  }

	const openGPS = (position) => {
	  const { lat, lon } = position;

	  const isAndroid = /Android/i.test(navigator.userAgent);
	  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

	  let url;

	  if (isAndroid) {
		url = `geo:${lat},${lon}?q=${lat},${lon}`;
	  } else if (isIOS) {
		url = `http://maps.apple.com/?daddr=${lat},${lon}`;
	  } else {
		url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
	  }

	  window.location.href = url;
	};
  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>

        {/* ── BACK ── */}
        <button
          style={{
            ...S.backBtn,
            color: hoveredBtn === "back" ? "var(--chalk)" : "var(--muted)",
          }}
          onMouseEnter={() => setHoveredBtn("back")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate("/topos")}
        >
          {t('topoDetail.back')}
        </button>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{t('topoDetail.eyebrow')}</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
            {editingTitle ? (
              <input
                type="text"
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                onKeyDown={async e => {
                  if (e.key === "Enter" && titleDraft.trim()) {
                    await api.patch(`/topos/${id}`, { title: titleDraft.trim() })
                    setTopo({ ...topo, title: titleDraft.trim() })
                    setEditingTitle(false)
                  }
                  if (e.key === "Escape") setEditingTitle(false)
                }}
                onBlur={async () => {
                  if (titleDraft.trim() && titleDraft.trim() !== topo.title) {
                    await api.patch(`/topos/${id}`, { title: titleDraft.trim() })
                    setTopo({ ...topo, title: titleDraft.trim() })
                  }
                  setEditingTitle(false)
                }}
                autoFocus
                style={{
                  ...S.formInput,
                  fontSize: "var(--title-3xl)",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  lineHeight: 0.95,
                  padding: "0.2rem 0.5rem",
                  margin: 0,
                }}
              />
            ) : (
              <h1 style={{ ...S.title, margin: 0 }}>{topo.title}</h1>
            )}
            <button
              style={{
                background: "none",
                border: "1px solid var(--line)",
                color: "var(--muted)",
                cursor: "pointer",
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.2rem 0.5rem",
                transition: "border-color 0.15s, color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--hold)"; e.currentTarget.style.color = "var(--hold)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--muted)" }}
              onClick={() => { setTitleDraft(topo.title); setEditingTitle(true) }}
            >
              {t('topoDetail.editTopo')}
            </button>
          </div>
          <div style={S.metaRow}>
            <span style={S.routeCount}>{t('topoDetail.route', { count: routes.length })}</span>
          </div>

  		  <div style={S.btnRow}>
  		    <button
  		  	style={{
  		  	  ...S.btnGhost,
  		  	  borderColor: hoveredBtn === "addRoute" ? "var(--hold)" : "var(--line)",
  		  	  color: hoveredBtn === "addRoute" ? "var(--hold)" : "var(--chalk)",
  		  	}}
  		  	onMouseEnter={() => setHoveredBtn("addRoute")}
  		  	onMouseLeave={() => setHoveredBtn(null)}
  		  	onClick={() => setShowAddForm(v => !v)}
  		    >
  		  	{t(showAddForm ? 'topoDetail.cancelAdd' : 'topoDetail.addRoute')}
  		    </button>
  		  </div>
			{showAddForm && (
			  <div style={{ ...S.card, marginTop: "1.5rem" }}>
				<div style={S.cardTitle}>{t('topoDetail.addRoute')}</div>

				<div style={S.formGrid}>
				  <div style={S.formField}>
					<label style={S.formLabel}>{t('topoDetail.name')}</label>
					<input
					  type="text"
					  style={S.formInput}
					  value={addForm.name}
					  onChange={e =>
						setAddForm({ ...addForm, name: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>{t('topoDetail.grade')}</label>
					<input
					  type="text"
					  style={S.formInput}
					  value={addForm.grade}
					  onChange={e =>
						setAddForm({ ...addForm, grade: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>{t('topoDetail.length')}</label>
					<input
					  type="number"
					  style={S.formInput}
					  value={addForm.length}
					  onChange={e =>
						setAddForm({ ...addForm, length: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>{t('topoDetail.routeIndex')}</label>
					<input
					  type="number"
					  style={S.formInput}
					  value={addForm.route_index}
					  onChange={e =>
						setAddForm({ ...addForm, route_index: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>
				</div>

				<button
				  style={{
					...S.btnPrimary,
					marginTop: "1rem",
					background:
					  hoveredBtn === "addRoute"
						? "var(--hold-lt)"
						: "var(--hold)",
				  }}
				  onMouseEnter={() => setHoveredBtn("addRoute")}
				  onMouseLeave={() => setHoveredBtn(null)}
				  onClick={submitRouteAdd}
				>
				  {t('topoDetail.addRoute')}
				</button>
			  </div>
			)}

        </div>

        {/* ── TOPO TAGS ── */}
        <TopoTagManager topoId={id} tags={tags} onTagsChange={setTags} />

        {/* ── ROUTE TAG BREAKDOWN ── */}
        <RouteTagBreakdown stats={routeTagStats} t={t} tagName={tagName} />

		{ parkingLocation?.lat != null ? (<button
		  style={{
				  	  ...S.btnGhost,
				  	  borderColor: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--line)",
				  	  color: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--chalk)",
				  }}
		  onMouseEnter={() => setHoveredBtn("setParkingLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={() => openGPS(parkingLocation)}
		>
		  {t('topoDetail.goParking')}
		</button>):
		(<button
		  style={{
  		  	  ...S.btnGhost,
  		  	  borderColor: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--line)",
  		  	  color: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--chalk)",
  		  }}
		  onMouseEnter={() => setHoveredBtn("setParkingLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={handleSetParking}
		>
		  {t('topoDetail.setParking')}
		</button>)}


		{ routesLocation?.lat != null ? (<button
		  style={{
				  	  ...S.btnGhost,
				  	  borderColor: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--line)",
				  	  color: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--chalk)",
					  marginBottom: "1rem",
				  }}
		  onMouseEnter={() => setHoveredBtn("setRoutesLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={() => openGPS(routesLocation)}
		>
		  {t('topoDetail.goRoutes')}
		</button>):
		(<button
		  style={{
  		  	  ...S.btnGhost,
  		  	  borderColor: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--line)",
  		  	  color: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--chalk)",
			  marginBottom: "1rem",
			
  		  	}}
		  onMouseEnter={() => setHoveredBtn("setRoutesLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={handleSetRoutes}
		>
		  {t('topoDetail.setRoutes')}
		</button>)}


        {/* ── MINIMAP ── */}
        {routesLocation?.lat != null ? (
          <div style={{
            marginBottom: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}>
            <span style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}>
              {t('topoDetail.location')}
            </span>
            <MiniMap lat={routesLocation.lat} lon={routesLocation.lon} />
          </div>
        ) : (
          <div style={{
            marginBottom: "1.5rem",
            fontFamily: "Barlow, sans-serif",
            fontSize: "0.8rem",
            fontStyle: "italic",
            color: "var(--line)",
          }}>
            {t('topoDetail.noLocation')}
          </div>
        )}

        {/* ── TOOLBAR ── */}
        <div style={S.toolbar}>
          <div style={S.toggleGroup}>
            <button
              style={S.toggleBtn(view === "grades")}
              onClick={() => setView("grades")}
            >
              {t('topoDetail.byGrade')}
            </button>
            <button
              style={{ ...S.toggleBtn(view === "index"), borderRight: "none" }}
              onClick={() => setView("index")}
            >
              {t('topoDetail.byIndex')}
            </button>
          </div>

          {!topo.filename ? null : topo.filename?.startsWith('http') ? (
            <a
              href={topo.filename}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...S.downloadBtn,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                borderColor: hoveredBtn === "view" ? "var(--hold)" : "var(--line)",
                color: hoveredBtn === "view" ? "var(--hold)" : "var(--muted)",
              }}
              onMouseEnter={() => setHoveredBtn("view")}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              {t('topoDetail.viewSource')}
            </a>
          ) : (
            <button
              disabled={downloaded}
              style={{
                ...S.downloadBtn,
                opacity: downloaded ? 0.5 : undefined,
                cursor: downloaded ? 'default' : 'pointer',
                borderColor: downloaded
                  ? 'var(--hold)'
                  : hoveredBtn === "dl" ? "var(--hold)" : "var(--line)",
                color: downloaded
                  ? 'var(--hold)'
                  : hoveredBtn === "dl" ? "var(--hold)" : "var(--muted)",
              }}
              onMouseEnter={() => !downloaded && setHoveredBtn("dl")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={async () => {
                if (downloaded) return
                try {
                  const res = await api.get(`/topos/${id}/download`, { responseType: 'blob' })
                  if (window.Capacitor?.isNativePlatform()) {
                    const { Filesystem, Directory } = await import('@capacitor/filesystem')
                    const reader = new FileReader()
                    const base64 = await new Promise((resolve, reject) => {
                      reader.onloadend = () => resolve(reader.result.split(',')[1])
                      reader.onerror = reject
                      reader.readAsDataURL(res.data)
                    })
                    const filename = topo.filename || 'topo.pdf'
                    await Filesystem.writeFile({
                      path: 'CragMaster/' + filename,
                      data: base64,
                      directory: Directory.Documents,
                      recursive: true,
                    })
                    setDownloaded(true)
                    showToast(t('topoDetail.downloadSuccess'))
                  } else {
                    const url = window.URL.createObjectURL(new Blob([res.data]))
                    const a = document.createElement('a')
                    a.href = url
                    a.download = topo.filename || 'topo.pdf'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                  }
                  setDownloadErr('')
                } catch (err) {
                  const msg = err.response?.data?.error || err.message || t('topoDetail.downloadFailed')
                  setDownloadErr(msg)
                  setTimeout(() => setDownloadErr(''), 4000)
                }
              }}
            >
              {downloaded ? '\u2713 ' + t('topoDetail.downloaded') : t('topoDetail.download')}
            </button>
          )}

          <button
            style={{
              ...S.downloadBtn,
              borderColor: offlineSaved ? "var(--good)" : hoveredBtn === "offline" ? "var(--hold)" : "var(--line)",
              color: offlineSaved ? "var(--good)" : hoveredBtn === "offline" ? "var(--hold)" : "var(--muted)",
            }}
            onMouseEnter={() => setHoveredBtn("offline")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={handleSaveOffline}
            disabled={savingOffline}
          >
            {savingOffline ? t('topoDetail.savingOffline') : offlineSaved ? t('topoDetail.savedOffline') : t('topoDetail.downloadOffline')}
          </button>
        </div>

        {/* ── Download error ── */}
        {downloadErr && (
          <p style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--hold-lt)',
            margin: '0 0 1rem',
            textAlign: 'center',
          }}>
            {downloadErr}
          </p>
        )}

        {/* ── GRADES VIEW ── */}
        {view === "grades" && (
          <div style={S.histogramSection}>
            {grades.map(g => {
              const count = gradesMap[g].length
              const barWidth = (count / maxCount) * 85
              const color = getGradeColor(gradesMap[g][0].sorting_grade)
              const expanded = expandedGrades[g]

              return (
                <div key={g}>
                  <div
                    style={{
                      ...S.histogramRow,
                      background: hoveredBtn === `grade-${g}` ? "rgba(255,255,255,0.02)" : "transparent",
                    }}
                    onMouseEnter={() => setHoveredBtn(`grade-${g}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    onClick={() => toggleGrade(g)}
                  >
                    <span style={S.gradeLabel}>{g}</span>
                    <div style={S.barTrack}>
                      <div style={S.bar(barWidth, color)} />
                    </div>
                    <span style={S.countLabel}>{count}</span>
                    <span style={S.chevron(expanded)}>›</span>
                  </div>

                  {expanded && (
                    <div style={S.routeDrawer}>
                      {gradesMap[g].map(route => (
                        <div
                          key={route.id}
                          style={{
                            ...S.routeRow,
                            background: hoveredRoute === route.id ? "rgba(255,255,255,0.03)" : "transparent",
                          }}
                          onMouseEnter={() => setHoveredRoute(route.id)}
                          onMouseLeave={() => setHoveredRoute(null)}
                          onClick={() => navigate("/routes/" + route.id)}
                        >
                          <span style={{
                            ...S.routeName,
                            ...(hoveredRoute === route.id ? S.routeNameHover : {}),
                          }}>
                            {route.name}
                          </span>
                          {route.length > 0 && (
                            <span style={S.routeLength}>{route.length}m</span>
                          )}
                          <span style={{
                            ...S.routeArrow,
                            color: hoveredRoute === route.id ? "var(--hold)" : "var(--line)",
                          }}>›</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── INDEX VIEW ── */}
        {view === "index" && (
          <div style={S.indexList}>
            {[...routes]
              .sort((a, b) => (a.route_index ?? 0) - (b.route_index ?? 0))
              .map(route => (
                <div
                  key={route.id}
                  style={{
                    ...S.indexRow,
                    background: hoveredRoute === route.id ? "rgba(255,255,255,0.02)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredRoute(route.id)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  onClick={() => navigate("/routes/" + route.id)}
                >
                  <span style={S.indexNum}>
                    {route.route_index >= 0 ? `#${route.route_index}` : "—"}
                  </span>
                  <span style={{
                    ...S.indexName,
                    color: hoveredRoute === route.id ? "var(--hold-lt)" : "var(--chalk)",
                  }}>
                    {route.name}
                  </span>
                  {route.length > 0 && (
                    <span style={S.routeLength}>{route.length}m</span>
                  )}
                  <span style={S.indexGrade(getGradeColor(route.sorting_grade))}>
                    {route.grade}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* ── CONFIRMATION MODAL ── */}
        {confirmModal && (
          <div style={S.overlay} onClick={() => setConfirmModal(null)}>
            <div style={S.modal} onClick={e => e.stopPropagation()}>
              <div style={S.modalTitle}>{t('topoDetail.confirmLocation')}</div>
              <p style={S.modalBody}>
                {confirmModal === 'parking'
                  ? t('topoDetail.confirmParkingBody')
                  : t('topoDetail.confirmRoutesBody')}
              </p>
              <p style={S.modalHint}>{t('topoDetail.confirmMapHint')}</p>
              <div style={S.modalActions}>
                <button
                  style={{
                    ...S.btnPrimary,
                    flex: 1,
                    minWidth: '120px',
                    background: hoveredBtn === 'confirmHere' ? 'var(--hold-lt)' : 'var(--hold)',
                  }}
                  onMouseEnter={() => setHoveredBtn('confirmHere')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={confirmAndSend}
                >
                  {t('topoDetail.confirmHere')}
                </button>
                <button
                  style={{
                    ...S.btnGhost,
                    flex: 1,
                    minWidth: '120px',
                    borderColor: hoveredBtn === 'setOnMap' ? 'var(--hold)' : 'var(--line)',
                    color: hoveredBtn === 'setOnMap' ? 'var(--hold)' : 'var(--chalk)',
                  }}
                  onMouseEnter={() => setHoveredBtn('setOnMap')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={handleSetOnMap}
                >
                  {t('topoDetail.confirmSetOnMap')}
                </button>
                <button
                  style={S.modalCancel}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--chalk)'
                    e.currentTarget.style.color = 'var(--chalk)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--line)'
                    e.currentTarget.style.color = 'var(--muted)'
                  }}
                  onClick={() => setConfirmModal(null)}
                >
                  {t('topoDetail.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

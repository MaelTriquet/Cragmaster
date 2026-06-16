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

import { useEffect, useState, useRef, useCallback } from "react"
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import { getOfflineRoute, addPendingAction, updateCachedRoute, getConnectionStatus, isOnline, ping } from '../lib/offline'
import { useToast } from '../contexts/ToastContext'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

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

  // ── HEADER ──────────────────────────────────────────────
  header: {
    borderLeft: "4px solid var(--hold)",
    paddingLeft: "1.5rem",
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
    fontSize: "var(--title-3xl)",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: "0 0 0.5rem 0",
    lineHeight: 0.95,
  },

  gradeBadge: {
    display: "inline-block",
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--chalk)",
    background: "var(--hold)",
    padding: "0.2rem 0.65rem",
    marginRight: "0.75rem",
  },

  avgGradeBadge: {
    display: "inline-block",
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.82rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "var(--muted)",
    border: "1px solid var(--line)",
    padding: "0.15rem 0.5rem",
    marginRight: "0.75rem",
  },

  metaLine: {
    marginTop: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  metaText: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    color: "var(--muted)",
  },

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

  // ── TAGS ──────────────────────────────────────────────
  tagsSection: {
    marginTop: "1.5rem",
    borderTop: "1px solid var(--line)",
    paddingTop: "1.25rem",
  },

  tagsTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "1rem",
  },

  tagCategoryRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.5rem",
    padding: "0.3rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
  },

  tagCategoryLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--hold)",
    minWidth: "6.5rem",
    flexShrink: 0,
  },

  tagCategoryTags: {
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

  // ── CARDS ──────────────────────────────────────────────
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

  // ── ATTEMPTS ──────────────────────────────────────────
  attemptsRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  attemptStat: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "var(--chalk)",
    lineHeight: 1,
  },

  attemptLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginTop: "0.1rem",
  },

  sentBadge: (sent) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.25rem 0.65rem",
    background: sent ? "rgba(90,158,111,0.15)" : "rgba(255,255,255,0.04)",
    color: sent ? "#7fc99a" : "var(--muted)",
    border: `1px solid ${sent ? "var(--good)" : "var(--line)"}`,
  }),

  btnRow: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.25rem",
    flexWrap: "wrap",
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

  // ── COMMENT FORM ──────────────────────────────────────
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

  commentItem: {
    padding: "1rem 0",
    borderBottom: "1px solid var(--line)",
  },

  commentHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.4rem",
    flexWrap: "wrap",
    gap: "0.5rem",
  },

  commentUser: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--chalk)",
  },

  commentStatus: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.2rem 0.5rem",
    borderRadius: "2px",
    marginLeft: "0.5rem",
  },

  commentMeta: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },

  commentStars: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.8rem",
    color: "var(--hold-lt)",
    letterSpacing: "0.05em",
  },

  commentGrade: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)",
    border: "1px solid var(--line)",
    padding: "0.1rem 0.4rem",
  },

  commentBody: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    color: "var(--chalk)",
    opacity: 0.8,
    lineHeight: 1.55,
  },

  commentBetaBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--hold)",
    cursor: "pointer",
    background: "none",
    border: "1px solid var(--hold)",
    padding: "0.15rem 0.55rem",
    marginTop: "0.5rem",
    transition: "background 0.15s",
  },

  commentBeta: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.88rem",
    color: "var(--chalk)",
    opacity: 0.85,
    lineHeight: 1.55,
    marginTop: "0.5rem",
    padding: "0.6rem 0.8rem",
    background: "rgba(255,255,255,0.04)",
    borderLeft: "2px solid var(--hold)",
  },

  emptyComments: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
    color: "var(--muted)",
    padding: "1rem 0",
  },
}

function StarDisplay({ value }) {
  const { t } = useTranslation()
  const v = parseFloat(value) || 0
  return (
    <span style={S.commentStars}>
      {[1, 2, 3, 4, 5].map(n => {
        if (v >= n) return <span key={n} style={{ color: "var(--hold-lt)" }}>★</span>
        if (v >= n - 0.5) return (
          <span key={n} style={{
            background: "linear-gradient(90deg, var(--hold-lt) 50%, var(--line) 50%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>★</span>
        )
        return <span key={n} style={{ color: "var(--line)" }}>☆</span>
      })}
      {" "}{t('routeDetail.outOfFive', { value: v.toFixed(1).replace(/\.0$/, '') })}
    </span>
  )
}

const CATEGORY_ORDER = ['route_style', 'hold', 'style', 'other']

// ── Tag management panel ───────────────────────────────────────────────────────
function TagManager({ routeId, tags, onTagsChange }) {
  const [allTags, setAllTags] = useState([])
  const [showPicker, setShowPicker] = useState(false)
  const [draftIds, setDraftIds] = useState(new Set())
  const [saving, setSaving] = useState(false)
  const [hovered, setHovered] = useState(null)
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()

  const tagName = (tag) => (i18n.language === 'fr' && tag.name_fr ? tag.name_fr : tag.name)

  useEffect(() => {
    api.get("/tags").then(res => setAllTags(res.data.tags || [])).catch(() => {})
  }, [])

  // Group all tags by category
  const allByCategory = {}
  for (const tag of allTags) {
    const cat = tag.category || 'other'
    if (!allByCategory[cat]) allByCategory[cat] = []
    allByCategory[cat].push(tag)
  }

  // Group route's assigned tags by category
  const assignedByCategory = {}
  for (const tag of tags) {
    const cat = tag.category || 'other'
    if (!assignedByCategory[cat]) assignedByCategory[cat] = []
    assignedByCategory[cat].push(tag)
  }
  const handleRemove = async (tagId) => {
    if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${routeId}/tags/${tagId}`, method: 'delete', type: 'community', summary: `Remove tag from route` }); return }
    const res = await api.delete(`/routes/${routeId}/tags/${tagId}`)
    onTagsChange(res.data.tags)
  }

  const handleSave = async () => {
    setSaving(true)
    const originalIds = new Set(tags.map(t => t.id))
    const toAdd = [...draftIds].filter(id => !originalIds.has(id))
    const toRemove = [...originalIds].filter(id => !draftIds.has(id))

    try {
      for (const tagId of toRemove) {
        if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${routeId}/tags/${tagId}`, method: 'delete', type: 'community', summary: `Remove tag from route` }); setSaving(false); return }
        const res = await api.delete(`/routes/${routeId}/tags/${tagId}`)
        onTagsChange(res.data.tags)
      }
      for (const tagId of toAdd) {
        if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${routeId}/tags`, method: 'post', body: { tag_id: tagId }, type: 'community', summary: `Assign tag to route` }); setSaving(false); return }
        const res = await api.post(`/routes/${routeId}/tags`, { tag_id: tagId })
        onTagsChange(res.data.tags)
      }
    } catch (e) {
      // API error — changes are partially saved; close and let parent state reflect what was committed
    }
    setSaving(false)
    setShowPicker(false)
  }

  const openPicker = () => {
    setDraftIds(new Set(tags.map(t => t.id)))
    setShowPicker(true)
  }

  const closePicker = () => {
    setShowPicker(false)
  }

  return (
    <div style={S.tagsSection}>
      <div style={S.tagsTitle}>{t('tags.title')}</div>
      {CATEGORY_ORDER.map(cat => {
        const assigned = assignedByCategory[cat] || []

        return (
          <div key={cat} style={S.tagCategoryRow}>
            <span style={S.tagCategoryLabel}>{t(`tags.category_${cat}`)}</span>
            <div style={S.tagCategoryTags}>
              {assigned.length > 0 ? assigned.map(tg => (
                <span key={tg.id} style={S.tagChip}>
                  {tagName(tg)}
                  <button
                    style={{
                      ...S.tagRemoveChip,
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
                <span style={S.noTagText}>{t('tags.noTag')}</span>
              )}
            </div>
          </div>
        )
      })}

      <button
        style={{
          ...S.addTagBtn,
          borderColor: showPicker ? "var(--hold)" : "var(--line)",
          color: showPicker ? "var(--hold)" : "var(--muted)",
        }}
        onMouseEnter={() => setHovered("addTags")}
        onMouseLeave={() => setHovered(null)}
        onClick={openPicker}
      >
        + {t('tags.addTag')}
      </button>

      {showPicker && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }} onClick={closePicker}>
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
                onClick={closePicker}
              >
                ✕
              </button>
            </div>

            <div style={{
              flex: 1, overflow: 'auto', padding: '1.25rem',
            }}>
              {CATEGORY_ORDER.map(cat => {
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
                        const inDraft = draftIds.has(tg.id)
                        return (
                          <button
                            key={tg.id}
                            style={{
                              fontFamily: 'Barlow Condensed, sans-serif',
                              fontSize: '0.68rem', fontWeight: 600,
                              letterSpacing: '0.05em', textTransform: 'uppercase',
                              padding: '0.3rem 0.6rem', borderRadius: '3px',
                              cursor: 'pointer', border: '1px solid',
                              background: inDraft ? 'var(--hold)' : 'transparent',
                              borderColor: inDraft ? 'var(--hold)' : 'var(--line)',
                              color: inDraft ? '#fff' : hovered === `pick-${tg.id}` ? 'var(--chalk)' : 'var(--muted)',
                            }}
                            onMouseEnter={() => setHovered(`pick-${tg.id}`)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => {
                              setDraftIds(prev => {
                                const next = new Set(prev)
                                if (next.has(tg.id)) next.delete(tg.id)
                                else next.add(tg.id)
                                return next
                              })
                            }}
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

            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: '0.5rem',
              padding: '0.75rem 1.25rem', borderTop: '1px solid var(--line)',
              flexShrink: 0,
            }}>
              <button
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.75rem', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '0.4rem 1rem', borderRadius: '3px',
                  border: '1px solid var(--line)',
                  background: 'transparent', color: 'var(--muted)',
                  cursor: 'pointer',
                }}
                onClick={closePicker}
              >
                {t('tags.cancel')}
              </button>
              <button
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.75rem', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '0.4rem 1rem', borderRadius: '3px',
                  border: 'none',
                  background: 'var(--hold)', color: '#fff',
                  cursor: saving ? 'wait' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}
                onClick={handleSave}
                disabled={saving}
              >
                {t('tags.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RouteDetail() {
  const { t, i18n } = useTranslation()
  const tagName = (tag) => (i18n.language === 'fr' && tag.name_fr ? tag.name_fr : tag.name)
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [route, setRoute] = useState(null)
  const [comments, setComments] = useState([])
  const [tags, setTags] = useState([])
  const [attempt, setAttempt] = useState(null)
  const [avgPerceivedGrade, setAvgPerceivedGrade] = useState(null)
  const [isProject, setIsProject] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)

  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [hoveredStar, setHoveredStar] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ stars: "", perceived_grade: "!", body: "", beta: "" })

  const [revealedBeta, setRevealedBeta] = useState(new Set())
  const [showEditForm, setShowEditForm] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", grade: "", length: "", route_index: "" })
  const [showCongrats, setShowCongrats] = useState(false)
  const [emptyCategories, setEmptyCategories] = useState([])
  const [allTags, setAllTags] = useState([])
  const [popupDraftIds, setPopupDraftIds] = useState(new Set())
  const [popupSaving, setPopupSaving] = useState(false)
  const [popupTagSearch, setPopupTagSearch] = useState("")
  const [popupHovered, setPopupHovered] = useState(null)
  const tagsRef = useRef(null)
  const initialTagIdsRef = useRef(null)
  const { showToast } = useToast()
  const photoInputRef = useRef(null)
  const apiBase = import.meta.env.VITE_API_URL || ''

  const applyRouteData = useCallback((d) => {
    setRoute(d.route)
    setComments(d.comments)
    setTags(d.tags || [])
    setAvgPerceivedGrade(d.avg_perceived_grade || null)
    setIsProject(d.is_project || false)
    setHasPhoto(d.has_photo || false)
    setEditForm({
      name: d.route.name || "",
      grade: d.route.grade || "",
      length: d.route.length > 0 ? d.route.length : "",
      route_index: d.route.route_index > 0 ? d.route.route_index : "",
    })
    if (!d.attempt || Object.keys(d.attempt).length === 0)
      setAttempt({ id: null, amount: 0, sent: false })
    else setAttempt(d.attempt)
  }, [])

  const loadRoute = useCallback(async () => {
    if (getConnectionStatus() === 0) await ping()
    if (!isOnline()) {
      const offline = await getOfflineRoute(id)
      if (offline) applyRouteData(offline)
      return
    }
    try {
      const res = await api.get(`/routes/${id}`)
      applyRouteData(res.data)
    } catch {
      const offline = await getOfflineRoute(id)
      if (offline) applyRouteData(offline)
    }
  }, [id, applyRouteData])

  useEffect(() => { loadRoute() }, [loadRoute])

  const submitRouteEdit = () => {
    if (!isOnline()) {
      addPendingAction({ endpoint: `/routes/${id}`, method: 'patch', body: editForm, type: 'community', summary: `Edit route "${route.name}"` })
      showToast(t('topoDetail.offlineQueued'))
      setShowEditForm(false)
      return
    }
    api.patch(`/routes/${id}`, editForm)
      .then(res => {
        setRoute(res.data.route)
        setShowEditForm(false)
      })
  }

  const addAttempt = () => {
    if (!isOnline()) {
      updateCachedRoute(id, data => ({
        ...data,
        attempt: data.attempt
          ? { ...data.attempt, amount: (data.attempt.amount || 0) + 1 }
          : { id: null, user_id: null, route_id: Number(id), sent: 0, amount: 1, sent_at: null },
      })).catch(() => {})
      setAttempt(prev => prev ? { ...prev, amount: (prev.amount || 0) + 1 } : { id: null, user_id: null, route_id: Number(id), sent: 0, amount: 1, sent_at: null })
      addPendingAction({ endpoint: `/routes/${id}/add_attempt`, method: 'get', type: 'user', summary: `Add attempt on route "${route.name}"` })
      showToast(t('routeDetail.offlineSaved'))
      return
    }
    api.get(`/routes/${id}/add_attempt`)
      .then(res => setAttempt(res.data.attempt))
  }

  const removeAttempt = () => {
    if (attemptCount === 0) return
    if (!isOnline()) {
      updateCachedRoute(id, data => ({
        ...data,
        attempt: data.attempt
          ? { ...data.attempt, amount: Math.max(0, (data.attempt.amount || 0) - 1) }
          : null,
      })).catch(() => {})
      setAttempt(prev => prev && prev.amount > 0 ? { ...prev, amount: prev.amount - 1 } : null)
      addPendingAction({ endpoint: `/routes/${id}/remove_attempt`, method: 'get', type: 'user', summary: `Remove attempt on route "${route.name}"` })
      showToast(t('routeDetail.offlineSaved'))
      return
    }
    api.get(`/routes/${id}/remove_attempt`)
      .then(res => setAttempt(res.data.attempt))
  }

  const sendAttempt = () => {
    if (isSent) {
      if (!isOnline()) {
        updateCachedRoute(id, data => ({
          ...data,
          attempt: data.attempt ? { ...data.attempt, sent: 0 } : null,
        })).catch(() => {})
        setAttempt(prev => prev ? { ...prev, sent: 0 } : null)
        addPendingAction({ endpoint: `/routes/${id}/unsent_attempt`, method: 'get', type: 'user', summary: `Unsend route "${route.name}"` })
        showToast(t('routeDetail.offlineSaved'))
        return
      }
      api.get(`/routes/${id}/unsent_attempt`)
        .then(res => setAttempt(res.data.attempt))
      return
    }
    if (!isOnline()) {
      updateCachedRoute(id, data => ({
        ...data,
        attempt: data.attempt
          ? { ...data.attempt, sent: 1, amount: (data.attempt.amount || 0) + 1 }
          : { id: null, user_id: null, route_id: Number(id), sent: 1, amount: 1, sent_at: null },
      })).catch(() => {})
      setAttempt(prev => prev ? { ...prev, sent: 1, amount: (prev.amount || 0) + 1 } : { id: null, user_id: null, route_id: Number(id), sent: 1, amount: 1, sent_at: null })
      addPendingAction({ endpoint: `/routes/${id}/sent_attempt`, method: 'get', type: 'user', summary: `Send route "${route.name}"` })
      showToast(t('routeDetail.offlineSaved'))
      return
    }
    api.get(`/routes/${id}/sent_attempt`)
      .then(res => {
        setAttempt(res.data.attempt)
        if (res.data.empty_categories?.length > 0) {
          setEmptyCategories(res.data.empty_categories)
          const initialIds = new Set(tags.map(t => t.id))
          initialTagIdsRef.current = initialIds
          setPopupDraftIds(new Set(initialIds))
          setShowCongrats(true)
          api.get("/tags").then(r => setAllTags(r.data.tags || [])).catch(() => {})
        }
      })
  }

  const toggleProject = () => {
    if (!isOnline()) {
      const newVal = !isProject
      updateCachedRoute(id, data => ({ ...data, is_project: newVal })).catch(() => {})
      setIsProject(newVal)
      addPendingAction({ endpoint: `/routes/${id}/project`, method: 'post', type: 'user', summary: `${newVal ? 'Add' : 'Remove'} project on route "${route.name}"` })
      showToast(t('routeDetail.offlineSaved'))
      return
    }
    api.post(`/routes/${id}/project`)
      .then(res => setIsProject(res.data.is_project))
  }

  const toggleForm = useCallback(() => {
    if (!showForm && user) {
      const mine = comments.find(c => c.user_id === user.id)
      if (mine) {
        setForm({
          stars: mine.stars ?? "",
          perceived_grade: mine.perceived_grade || "!",
          body: mine.body || "",
          beta: mine.beta || "",
        })
      } else {
        setForm({ stars: "", perceived_grade: "!", body: "", beta: "" })
      }
    } else {
      setForm({ stars: "", perceived_grade: "!", body: "", beta: "" })
    }
    setShowForm(p => !p)
  }, [showForm, user, comments])

  const uploadPhoto = async (file) => {
    const fd = new FormData()
    fd.append('photo', file)
    try {
      await api.post(`/routes/${id}/photo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setHasPhoto(true)
      showToast(t('routeDetail.photoAdded'))
    } catch {
      showToast(t('routeDetail.photoFailed'))
    }
  }

  const submitComment = () => {
    if (!isOnline()) {
      addPendingAction({ endpoint: `/routes/${id}/comments`, method: 'post', body: { ...form, perceived_grade: form.perceived_grade === "!" ? route.grade : form.perceived_grade }, type: 'user', summary: `Comment on route "${route.name}"` })
      setShowForm(false)
      setForm({ stars: "", perceived_grade: "!", body: "", beta: "" })
      showToast(t('routeDetail.offlineSaved'))
      return
    }
    const payload = { ...form }
    if (payload.perceived_grade === "!") payload.perceived_grade = route.grade
    api.post(`/routes/${id}/comments`, payload)
      .then(res => {
        setComments(prev => [res.data, ...prev.filter(c => c.user_id !== user?.id)])
        setShowForm(false)
        setForm({ stars: "", perceived_grade: "!", body: "", beta: "" })
      })
  }

  if (!route) return (
    <div style={{ ...S.root, justifyContent: "center" }}>
      <span style={{ fontFamily: "Barlow Condensed", fontSize: "1.2rem", letterSpacing: "0.1em", color: "var(--muted)" }}>
        {t('routeDetail.loading')}
      </span>
    </div>
  )

  const hasComment = user && comments.some(c => c.user_id === user.id)
  const attemptCount = attempt?.amount ?? 0
  const isSent = attempt?.sent
  const assignedTagIds = new Set(tags.map(t => t.id))
  const hasNewTags = initialTagIdsRef.current
    ? [...popupDraftIds].some(id => !initialTagIdsRef.current.has(id))
    : false

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
          onClick={() => navigate(`/topos/${route.topo_id}`)}
        >
          ← {route.topo_title}
        </button>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{t('routeDetail.eyebrow')}</span>
          <h1 style={S.title}>{route.name}</h1>
          <div style={S.metaLine}>
            <span style={S.gradeBadge}>{route.grade}</span>
            {avgPerceivedGrade && (
              <span style={S.avgGradeBadge} title={t('routeDetail.avgPerceived')}>{avgPerceivedGrade} {t('routeDetail.perceived')}</span>
            )}
            <span style={S.metaText}>{route.topo_title}</span>
            {route.topo_location && (
              <>
                <span style={{ color: "var(--line)" }}>·</span>
                <span style={S.metaText}>{route.topo_location}</span>
              </>
            )}
            {route.length > 0 && (
              <>
                <span style={{ color: "var(--line)" }}>·</span>
                <span style={S.metaText}>{route.length}m</span>
              </>
            )}
          </div>

          {/* ── TAGS ── */}
          <div ref={tagsRef}>
            <TagManager
              routeId={id}
              tags={tags}
              onTagsChange={setTags}
            />
          </div>

          {/* ── PROJECT + EDIT ROUTE BUTTONS ── */}
          <div style={S.btnRow}>
            <button
              style={{
                ...S.btnGhost,
                borderColor: isProject ? "var(--hold)" : "var(--line)",
                color: isProject ? "var(--hold)" : "var(--chalk)",
                background: isProject ? "rgba(200,80,42,0.08)" : "transparent",
              }}
              onMouseEnter={() => setHoveredBtn("project")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={toggleProject}
            >
              {t(isProject ? 'routeDetail.unmarkProject' : 'routeDetail.markProject')}
            </button>
            <button
              style={{
                ...S.btnGhost,
                borderColor: hoveredBtn === "editRoute" ? "var(--hold)" : "var(--line)",
                color: hoveredBtn === "editRoute" ? "var(--hold)" : "var(--chalk)",
              }}
              onMouseEnter={() => setHoveredBtn("editRoute")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={() => setShowEditForm(v => !v)}
            >
              {t(showEditForm ? 'routeDetail.cancelEdit' : 'routeDetail.editRoute')}
            </button>
          </div>

          {showEditForm && (
            <div style={{ ...S.card, marginTop: "1.5rem" }}>
              <div style={S.cardTitle}>{t('routeDetail.editRoute')}</div>
              <div style={S.formGrid}>
                <div style={S.formField}>
                  <label style={S.formLabel}>{t('routeDetail.name')}</label>
                  <input
                    type="text"
                    style={S.formInput}
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>{t('routeDetail.grade')}</label>
                  <input
                    type="text"
                    style={S.formInput}
                    value={editForm.grade}
                    onChange={e => setEditForm({ ...editForm, grade: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>{t('routeDetail.length')}</label>
                  <input
                    type="number"
                    style={S.formInput}
                    value={editForm.length}
                    onChange={e => setEditForm({ ...editForm, length: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>{t('routeDetail.routeIndex')}</label>
                  <input
                    type="number"
                    style={S.formInput}
                    value={editForm.route_index}
                    onChange={e => setEditForm({ ...editForm, route_index: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>
              </div>
              <button
                style={{
                  ...S.btnPrimary,
                  marginTop: "1rem",
                  background: hoveredBtn === "saveRoute" ? "var(--hold-lt)" : "var(--hold)",
                }}
                onMouseEnter={() => setHoveredBtn("saveRoute")}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={submitRouteEdit}
              >
                {t('routeDetail.saveChanges')}
              </button>
            </div>
          )}
        </div>

        {/* ── PHOTO ── */}
        <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
          {hasPhoto ? (
            <div style={{ position: "relative" }}>
              <img
                src={`${apiBase}/api/routes/${id}/photo?t=${Date.now()}`}
                alt={route.name}
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  background: "rgba(0,0,0,0.35)",
                  display: "block",
                }}
              />
              <button
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.3rem 0.6rem",
                  background: "rgba(0,0,0,0.7)",
                  color: "var(--chalk)",
                  border: "1px solid var(--line)",
                  cursor: "pointer",
                  zIndex: 1,
                }}
                onMouseEnter={e => { e.target.style.color = "var(--hold-lt)"; e.target.style.borderColor = "var(--hold-lt)" }}
                onMouseLeave={e => { e.target.style.color = "var(--chalk)"; e.target.style.borderColor = "var(--line)" }}
                onClick={async () => {
                  if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${id}/photo`, method: 'delete', type: 'community', summary: `Delete photo of route "${route.name}"` }); return }
                  await api.delete(`/routes/${id}/photo`)
                  setHasPhoto(false)
                }}
              >
                {t('routeDetail.deletePhoto')}
              </button>
            </div>
          ) : (
            <div style={{ padding: "1.5rem 1.75rem" }}>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${id}/photo`, method: 'post', type: 'community', summary: `Upload photo for route "${route.name}"` }); e.target.value = ''; return }
                  await uploadPhoto(file)
                  e.target.value = ''
                }}
              />
              <button
                style={{
                  ...S.addTagBtn,
                  borderColor: hoveredBtn === "addPhoto" ? "var(--hold)" : "var(--line)",
                  color: hoveredBtn === "addPhoto" ? "var(--hold)" : "var(--muted)",
                }}
                onMouseEnter={() => setHoveredBtn("addPhoto")}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={async () => {
                  if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${id}/photo`, method: 'post', type: 'community', summary: `Upload photo for route "${route.name}"` }); return }
                  if (window.Capacitor?.isNativePlatform()) {
                    try {
                      const image = await Camera.getPhoto({
                        quality: 85,
                        allowEditing: false,
                        resultType: CameraResultType.Base64,
                        source: CameraSource.Prompt,
                      })
                      if (!image.base64String) return
                      const blob = await (await fetch(`data:image/${image.format};base64,${image.base64String}`)).blob()
                      const file = new File([blob], `photo.${image.format}`, { type: `image/${image.format}` })
                      await uploadPhoto(file)
                    } catch {
                      showToast(t('routeDetail.photoFailed'))
                    }
                  } else {
                    photoInputRef.current?.click()
                  }
                }}
              >
                + {t('routeDetail.addPhoto')}
              </button>
            </div>
          )}
        </div>

        {/* ── ATTEMPTS CARD ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>{t('routeDetail.attempts')}</div>
          <div style={S.attemptsRow}>
            <div>
              <div style={S.attemptStat}>{attemptCount}</div>
              <div style={S.attemptLabel}>
                {t('routeDetail.attempt', { count: attemptCount })}
              </div>
            </div>
            <div style={{ width: "1px", height: "36px", background: "var(--line)", margin: "0 0.25rem" }} />
            <span style={S.sentBadge(isSent)}>
              {isSent ? t('routeDetail.sent') : attemptCount > 0 ? t('routeDetail.working') : t('routeDetail.notAttempted')}
            </span>
          </div>
          <div style={S.btnRow}>
            <button
              style={{
                ...S.btnGhost,
                borderColor: hoveredBtn === "removeAttempt" ? "var(--hold)" : "var(--line)",
                color: hoveredBtn === "removeAttempt" ? "var(--hold)" : "var(--chalk)",
              }}
              onMouseEnter={() => setHoveredBtn("removeAttempt")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={removeAttempt}
            >
              {t('routeDetail.removeAttempt')}
            </button>
            <button
              style={{
                ...S.btnGhost,
                borderColor: hoveredBtn === "attempt" ? "var(--hold)" : "var(--line)",
                color: hoveredBtn === "attempt" ? "var(--hold)" : "var(--chalk)",
              }}
              onMouseEnter={() => setHoveredBtn("attempt")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={addAttempt}
            >
              {t('routeDetail.addAttempt')}
            </button>
            <button
              style={{
                ...S.btnPrimary,
                background: hoveredBtn === "sent" ? "var(--hold-lt)" : isSent ? "var(--good)" : "var(--hold)",
              }}
              onMouseEnter={() => setHoveredBtn("sent")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={sendAttempt}
            >
              {isSent ? t('routeDetail.sent') : t('routeDetail.markSent')}
            </button>
          </div>
        </div>

        {/* ── FIRST SENT CONGRATULATIONS ── */}
        {showCongrats && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--rock)', display: 'flex',
            flexDirection: 'column',
            paddingTop: '52px',
          }}>
            {/* ── header ── */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.5rem', borderBottom: '1px solid var(--line)',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '2.3rem', fontWeight: 700, color: 'var(--chalk)',
              }}>
                🎉 {t('routeDetail.firstSentTitle')}
              </span>
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: '1.2rem', padding: '0.25rem',
                  lineHeight: 1,
                }}
                onMouseEnter={e => e.target.style.color = 'var(--chalk)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                onClick={() => { initialTagIdsRef.current = null; setShowCongrats(false) }}
              >
                ✕
              </button>
            </div>

            {/* ── body ── */}
            <div style={{
              flex: 1, overflow: 'auto', padding: '1.5rem',
              fontFamily: 'Barlow, sans-serif', fontSize: '0.9rem',
              color: 'var(--text)', lineHeight: 1.6,
            }}>
              <p style={{ marginBottom: '1.25rem' }}>
                {t('routeDetail.firstSentBody')}
              </p>

              {/* ── tag categories ── */}
              {CATEGORY_ORDER.map(cat => {
                const catTags = allTags.filter(t => (t.category || 'other') === cat)
                const catLabel = t(`tags.category_${cat}`).toLowerCase()
                const srch = popupTagSearch.toLowerCase()
                const matched = srch === ''
                  ? true
                  : catLabel.includes(srch) || catTags.some(t => t.name.toLowerCase().includes(srch))
                if (!matched && srch) return null
                const filtered = srch
                  ? catTags.filter(t => t.name.toLowerCase().includes(srch) || catLabel.includes(srch))
                  : catTags
                if (filtered.length === 0 && !catLabel.includes(srch)) return null
                const isEmpty = emptyCategories.includes(cat)
                return (
                  <div key={cat} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: '0.75rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: isEmpty ? 'var(--hold-lt)' : 'var(--muted)',
                      marginBottom: '0.4rem',
                    }}>
                      {t(`tags.category_${cat}`)}
                      {isEmpty && <span style={{ color: 'var(--hold)', marginLeft: '0.4rem', fontSize: '0.65rem' }}>{t('routeDetail.tagNew')}</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {filtered.map(tg => {
                        const inDraft = popupDraftIds.has(tg.id)
                        const key = `pop-${tg.id}`
                        return (
                          <button
                            key={tg.id}
                            style={{
                              fontFamily: 'Barlow Condensed, sans-serif',
                              fontSize: '0.65rem', fontWeight: 600,
                              letterSpacing: '0.05em', textTransform: 'uppercase',
                              padding: '0.3rem 0.65rem', borderRadius: '3px',
                              cursor: 'pointer', border: '1px solid',
                              background: inDraft ? 'var(--hold)' : 'transparent',
                              borderColor: inDraft ? 'var(--hold)' : 'var(--line)',
                              color: inDraft ? '#fff' : popupHovered === key ? 'var(--chalk)' : 'var(--muted)',
                              transition: 'none',
                            }}
                            onMouseEnter={() => setPopupHovered(key)}
                            onMouseLeave={() => setPopupHovered(null)}
                            onClick={() => {
                              setPopupDraftIds(prev => {
                                const next = new Set(prev)
                                if (next.has(tg.id)) next.delete(tg.id)
                                else next.add(tg.id)
                                return next
                              })
                            }}
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

            {/* ── footer ── */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
              padding: '1rem 1.5rem', borderTop: '1px solid var(--line)',
              flexShrink: 0,
            }}>
              <button
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.75rem', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '0.6rem 1rem', borderRadius: '3px',
                  border: '1px solid var(--line)',
                  background: 'transparent', color: 'var(--muted)',
                  cursor: 'pointer',
                }}
                onClick={() => { initialTagIdsRef.current = null; setShowCongrats(false) }}
              >
                {t('routeDetail.dismiss')}
              </button>
              <button
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.75rem', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '0.6rem 1.4rem', borderRadius: '3px',
                  border: 'none',
                  background: 'var(--hold)', color: '#fff',
                  cursor: popupSaving ? 'wait' : 'pointer',
                  opacity: popupSaving ? 0.6 : 1,
                }}
                disabled={popupSaving || !hasNewTags}
                onClick={async () => {
                  setPopupSaving(true)
                  const originalIds = initialTagIdsRef.current
                  if (!originalIds) { setShowCongrats(false); return }
                  const toAdd = [...popupDraftIds].filter(id => !originalIds.has(id))
                  const toRemove = [...originalIds].filter(id => !popupDraftIds.has(id))
                  try {
                    for (const tagId of toRemove) {
                      if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${id}/tags/${tagId}`, method: 'delete', type: 'community', summary: `Remove tag from route` }); setPopupSaving(false); return }
                      await api.delete(`/routes/${id}/tags/${tagId}`)
                    }
                    for (const tagId of toAdd) {
                      if (!isOnline()) { showToast(t('topoDetail.offlineQueued')); addPendingAction({ endpoint: `/routes/${id}/tags`, method: 'post', body: { tag_id: tagId }, type: 'community', summary: `Assign tag to route` }); setPopupSaving(false); return }
                      await api.post(`/routes/${id}/tags`, { tag_id: tagId })
                    }
                    // reload tags after all changes
                    const fresh = await api.get(`/routes/${id}`)
                    setTags(fresh.data.tags || [])
                  } catch (e) {
                    // partial save
                  }
                  initialTagIdsRef.current = null
                  setPopupSaving(false)
                  setShowCongrats(false)
                }}
              >
                {t('tags.save')}
              </button>
            </div>
          </div>
        )}

        {/* ── COMMENTS CARD ── */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ ...S.cardTitle, marginBottom: 0 }}>
              {t('routeDetail.commentsCount', { count: comments.length })}
            </div>
            <button
              style={{
                ...S.btnGhost,
                fontSize: "0.75rem",
                padding: "0.4rem 0.9rem",
                borderColor: showForm || hoveredBtn === "toggleForm" ? "var(--hold)" : "var(--line)",
                color: showForm || hoveredBtn === "toggleForm" ? "var(--hold)" : "var(--chalk)",
              }}
              onMouseEnter={() => setHoveredBtn("toggleForm")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={toggleForm}
            >
              {t(showForm ? 'routeDetail.cancel' : (hasComment ? 'routeDetail.editComment' : 'routeDetail.addComment'))}
            </button>
          </div>

          {showForm && (
            <>
              <div style={S.formGrid}>
                <div style={S.formField}>
                  <label style={S.formLabel}>{t('routeDetail.stars')}</label>
                  <div style={{ display: "flex", gap: "0.25rem", paddingTop: "0.2rem" }} onMouseLeave={() => setHoveredStar(null)}>
                    {[1, 2, 3, 4, 5].map(n => {
                      const val = hoveredStar !== null ? hoveredStar : (parseFloat(form.stars) || 0)
                      const fillWidth = val >= n ? "100%" : val >= n - 0.5 ? "50%" : "0%"
                      return (
                        <div key={n} style={{ position: "relative", width: "1.3rem", height: "1.3rem", display: "inline-block" }}>
                          <span style={{ position: "absolute", inset: 0, color: "var(--line)", fontSize: "1.3rem", lineHeight: 1 }}>★</span>
                          <span style={{
                            position: "absolute", inset: 0,
                            color: "var(--hold-lt)", fontSize: "1.3rem", lineHeight: 1,
                            width: fillWidth, overflow: "hidden",
                            pointerEvents: "none",
                          }}>★</span>
                          <span
                            style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", cursor: "pointer", zIndex: 1 }}
                            onClick={() => setForm({ ...form, stars: String(n - 0.5) })}
                            onMouseEnter={() => setHoveredStar(n - 0.5)}
                          />
                          <span
                            style={{ position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", cursor: "pointer", zIndex: 1 }}
                            onClick={() => setForm({ ...form, stars: String(n) })}
                            onMouseEnter={() => setHoveredStar(n)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>{t('routeDetail.perceivedGrade')}</label>
                  <input
                    type="text"
                    style={S.formInput}
                    placeholder={route.grade}
                    value={form.perceived_grade === "!" ? "" : form.perceived_grade}
                    onChange={e => setForm({ ...form, perceived_grade: e.target.value || "!" })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>
                <div style={S.formFieldFull}>
                  <label style={S.formLabel}>{t('routeDetail.comment')}</label>
                  <textarea
                    style={S.formTextarea}
                    placeholder={t('routeDetail.commentPlaceholder')}
                    value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>
                <div style={S.formFieldFull}>
                  <label style={S.formLabel}>{t('routeDetail.betaLabel')}</label>
                  <textarea
                    style={S.formTextarea}
                    placeholder={t('routeDetail.betaPlaceholder')}
                    value={form.beta}
                    onChange={e => setForm({ ...form, beta: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>
              </div>
              <button
                style={{
                  ...S.btnPrimary,
                  background: hoveredBtn === "submit" ? "var(--hold-lt)" : "var(--hold)",
                }}
                onMouseEnter={() => setHoveredBtn("submit")}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={submitComment}
              >
                {hasComment ? t('routeDetail.editComment') : t('routeDetail.submitComment')}
              </button>
              <div style={S.divider} />
            </>
          )}

          {comments.length === 0 ? (
            <p style={S.emptyComments}>{t('routeDetail.noComments')}</p>
          ) : (
            comments.map(c => {
              const show = revealedBeta.has(c.id)
              return (
              <div key={c.id} style={S.commentItem}>
                <div style={S.commentHeader}>
                  <span style={{ ...S.commentUser, cursor: 'pointer' }} onClick={() => navigate(`/stats/${c.user_id}`)}>
                    {c.username}
                    {c.user_status && (() => {
                      const statusStyle = {
                        sent: { background: "rgba(90,158,111,0.2)", color: "#7fc99a" },
                        project: { background: "rgba(200,80,42,0.2)", color: "var(--hold)" },
                        working: { background: "rgba(200,180,60,0.15)", color: "#d4c86a" },
                      }[c.user_status] || {}
                      const statusKey = `routeDetail.status${c.user_status.charAt(0).toUpperCase() + c.user_status.slice(1)}`
                      return <span style={{ ...S.commentStatus, ...statusStyle }}>{t(statusKey)}</span>
                    })()}
                  </span>
                  <div style={S.commentMeta}>
                    {c.perceived_grade && (
                      <span style={S.commentGrade}>{c.perceived_grade}</span>
                    )}
                    <StarDisplay value={c.stars} />
                  </div>
                </div>
                {c.body && <p style={S.commentBody}>{c.body}</p>}
                {c.beta && (
                  <>
                    {!show && (
                      <button
                        style={S.commentBetaBtn}
                        onClick={() => setRevealedBeta(prev => new Set(prev).add(c.id))}
                      >
                        {t('routeDetail.showBeta')}
                      </button>
                    )}
                    {show && <div style={S.commentBeta}>{c.beta}</div>}
                  </>
                )}
              </div>
            )})
          )}
        </div>

      </div>
    </div>
  )
}

import { useEffect, useState, useRef, useCallback } from "react"
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/client'
import { useAuth } from '../contexts/AuthContext'

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

  addTagBtnSmall: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.1rem 0.4rem",
    border: "1px dashed var(--line)",
    color: "var(--muted)",
    background: "none",
    cursor: "pointer",
    flexShrink: 0,
    transition: "border-color 0.15s, color 0.15s",
  },

  // ── TAG PICKER ──
  tagPicker: {
    background: "var(--granite)",
    border: "1px solid var(--line)",
    padding: "0.75rem 1rem",
    marginTop: "0.4rem",
    marginBottom: "0.3rem",
  },

  tagPickerSearch: {
    width: "100%",
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.85rem",
    padding: "0.4rem 0.65rem",
    outline: "none",
    marginBottom: "0.6rem",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },

  tagPickerList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.35rem",
    maxHeight: "140px",
    overflowY: "auto",
  },

  tagPickerBtn: (assigned) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.15rem 0.5rem",
    border: `1px solid ${assigned ? "var(--hold)" : "var(--line)"}`,
    color: assigned ? "var(--hold)" : "var(--muted)",
    background: assigned ? "rgba(200,80,42,0.1)" : "transparent",
    cursor: assigned ? "default" : "pointer",
    transition: "border-color 0.15s, color 0.15s, background 0.15s",
  }),

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
    border: `1px solid ${sent ? "#5a9e6f" : "var(--line)"}`,
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
    gridTemplateColumns: "1fr 1fr",
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
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.1rem 0.4rem",
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
  const n = Math.round(parseFloat(value) || 0)
  return (
    <span style={S.commentStars}>
      {"★".repeat(Math.max(0, Math.min(5, n)))}{"☆".repeat(Math.max(0, 5 - Math.min(5, n)))}
      {" "}{t('routeDetail.outOfFive', { value })}
    </span>
  )
}

const CATEGORY_ORDER = ['route_style', 'hold', 'approche', 'exposure', 'style', 'other']

// ── Tag management panel ───────────────────────────────────────────────────────
function TagManager({ routeId, tags, onTagsChange }) {
  const [allTags, setAllTags] = useState([])
  const [pickerOpen, setPickerOpen] = useState(null)
  const [pickerSearch, setPickerSearch] = useState({})
  const [hovered, setHovered] = useState(null)
  const { t, i18n } = useTranslation()

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
  const assignedIds = new Set(tags.map(t => t.id))

  const handleAssign = async (tagId) => {
    if (assignedIds.has(tagId)) return
    const res = await api.post(`/routes/${routeId}/tags`, { tag_id: tagId })
    onTagsChange(res.data.tags)
  }

  const handleRemove = async (tagId) => {
    const res = await api.delete(`/routes/${routeId}/tags/${tagId}`)
    onTagsChange(res.data.tags)
  }

  const togglePicker = (cat) => {
    setPickerOpen(prev => prev === cat ? null : cat)
    setPickerSearch({})
  }

  return (
    <div style={S.tagsSection}>
      <div style={S.tagsTitle}>{t('tags.title')}</div>
      {CATEGORY_ORDER.map(cat => {
        const assigned = assignedByCategory[cat] || []
        const available = allByCategory[cat] || []
        const search = (pickerSearch[cat] || '').toLowerCase()
        const filtered = search
          ? available.filter(t => t.name.toLowerCase().includes(search))
          : available

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
            <button
              style={{
                ...S.addTagBtnSmall,
                borderColor: pickerOpen === cat ? "var(--hold)" : "var(--line)",
                color: pickerOpen === cat ? "var(--hold)" : "var(--muted)",
              }}
              onMouseEnter={() => setHovered(`add-${cat}`)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => togglePicker(cat)}
            >
              {t('tags.addTag')}
            </button>

            {pickerOpen === cat && (
              <div style={S.tagPicker}>
                <input
                  style={S.tagPickerSearch}
                  type="text"
                  placeholder={t('tags.searchPlaceholder')}
                  value={pickerSearch[cat] || ''}
                  onChange={e => setPickerSearch({ ...pickerSearch, [cat]: e.target.value })}
                  onFocus={e => e.target.style.borderColor = "var(--hold)"}
                  onBlur={e => e.target.style.borderColor = "var(--line)"}
                  autoFocus
                />
                <div style={S.tagPickerList}>
                  {filtered.length === 0 && (
                    <span style={{ fontFamily: "Barlow, sans-serif", fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic" }}>
                      {search ? 'No match' : 'No tags'}
                    </span>
                  )}
                  {filtered.map(tg => {
                    const as = assignedIds.has(tg.id)
                    return (
                      <button
                        key={tg.id}
                        style={{
                          ...S.tagPickerBtn(as),
                          ...(hovered === `pick-${tg.id}` && !as
                            ? { borderColor: "var(--chalk)", color: "var(--chalk)" }
                            : {}),
                        }}
                        disabled={as}
                        onMouseEnter={() => !as && setHovered(`pick-${tg.id}`)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleAssign(tg.id)}
                      >
                        {tagName(tg)}{as && ' ✓'}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
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

  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ stars: "", perceived_grade: "!", body: "", beta: "" })

  const [revealedBeta, setRevealedBeta] = useState(new Set())
  const [showEditForm, setShowEditForm] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", grade: "", length: "", route_index: "" })
  const [showCongrats, setShowCongrats] = useState(false)
  const [emptyCategories, setEmptyCategories] = useState([])
  const [allTags, setAllTags] = useState([])
  const [popupTagSearch, setPopupTagSearch] = useState("")
  const [popupHovered, setPopupHovered] = useState(null)
  const tagsRef = useRef(null)
  const initialTagIdsRef = useRef(null)

  useEffect(() => {
    api.get(`/routes/${id}`)
      .then(res => {
        const d = res.data
        setRoute(d.route)
        setComments(d.comments)
        setTags(d.tags || [])
        setAvgPerceivedGrade(d.avg_perceived_grade || null)
        setIsProject(d.is_project || false)
        setEditForm({
          name: d.route.name || "",
          grade: d.route.grade || "",
          length: d.route.length > 0 ? d.route.length : "",
          route_index: d.route.route_index > 0 ? d.route.route_index : "",
        })
        if (!d.attempt || Object.keys(d.attempt).length === 0)
          setAttempt({ id: null, amount: 0, sent: false })
        else setAttempt(d.attempt)
      })
  }, [id])

  const submitRouteEdit = () => {
    api.patch(`/routes/${id}`, editForm)
      .then(res => {
        setRoute(res.data.route)
        setShowEditForm(false)
      })
  }

  const addAttempt = () => {
    api.get(`/routes/${id}/add_attempt`)
      .then(res => setAttempt(res.data.attempt))
  }

  const sendAttempt = () => {
    api.get(`/routes/${id}/sent_attempt`)
      .then(res => {
        setAttempt(res.data.attempt)
        if (res.data.empty_categories?.length > 0) {
          setEmptyCategories(res.data.empty_categories)
          initialTagIdsRef.current = new Set(tags.map(t => t.id))
          setShowCongrats(true)
          api.get("/tags").then(r => setAllTags(r.data.tags || [])).catch(() => {})
        }
      })
  }

  const toggleProject = () => {
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

  const submitComment = () => {
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

  const attemptCount = attempt?.amount ?? 0
  const isSent = attempt?.sent
  const assignedTagIds = new Set(tags.map(t => t.id))
  const hasNewTags = initialTagIdsRef.current
    ? tags.some(t => !initialTagIdsRef.current.has(t.id))
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
            {route.length && route.length > 0 && (
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
                background: hoveredBtn === "sent" ? "var(--hold-lt)" : "var(--hold)",
              }}
              onMouseEnter={() => setHoveredBtn("sent")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={sendAttempt}
            >
              {t('routeDetail.markSent')}
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
                onClick={() => setShowCongrats(false)}
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
                      {isEmpty && <span style={{ color: 'var(--hold)', marginLeft: '0.4rem', fontSize: '0.65rem' }}>(new)</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {filtered.map(tg => {
                        const assigned = assignedTagIds.has(tg.id)
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
                              background: assigned ? 'var(--hold)' : 'transparent',
                              borderColor: assigned ? 'var(--hold)' : 'var(--line)',
                              color: assigned ? '#fff' : popupHovered === key ? 'var(--chalk)' : 'var(--muted)',
                              transition: 'none',
                            }}
                            onMouseEnter={() => setPopupHovered(key)}
                            onMouseLeave={() => setPopupHovered(null)}
                            onClick={async () => {
                              if (assigned) {
                                const res = await api.delete(`/routes/${id}/tags/${tg.id}`)
                                setTags(res.data.tags)
                              } else {
                                const res = await api.post(`/routes/${id}/tags`, { tag_id: tg.id })
                                setTags(res.data.tags)
                                // check if this category is no longer empty
                                const newAssigned = res.data.tags
                                const catIds = allTags.filter(t => t.category === cat).map(t => t.id)
                                const nowHasTag = newAssigned.some(t => catIds.includes(t.id))
                                if (isEmpty && nowHasTag) {
                                  setEmptyCategories(prev => prev.filter(c => c !== cat))
                                }
                              }
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
                  {t('tags.loading', { defaultValue: 'Loading tags...' })}
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
                  padding: '0.6rem 1.4rem', cursor: 'pointer',
                  background: 'transparent',
                  border: `1px solid ${hasNewTags ? 'var(--hold)' : 'var(--line)'}`,
                  borderRadius: '4px',
                  color: hasNewTags ? 'var(--hold)' : 'var(--muted)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em',
                }}
                onMouseEnter={e => { e.target.style.color = hasNewTags ? 'var(--hold-lt)' : 'var(--chalk)'; e.target.style.borderColor = hasNewTags ? 'var(--hold-lt)' : 'var(--chalk)' }}
                onMouseLeave={e => { e.target.style.color = hasNewTags ? 'var(--hold)' : 'var(--muted)'; e.target.style.borderColor = hasNewTags ? 'var(--hold)' : 'var(--line)' }}
                onClick={() => { initialTagIdsRef.current = null; setShowCongrats(false) }}
              >
                {t(hasNewTags ? 'routeDetail.save' : 'routeDetail.dismiss')}
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
              {t(showForm ? 'routeDetail.cancel' : 'routeDetail.addComment')}
            </button>
          </div>

          {showForm && (
            <>
              <div style={S.formGrid}>
                <div style={S.formField}>
                  <label style={S.formLabel}>{t('routeDetail.stars')}</label>
                  <input
                    type="number" min="0" max="5" step="0.5"
                    style={S.formInput}
                    placeholder={t('routeDetail.starsPlaceholder')}
                    value={form.stars}
                    onChange={e => setForm({ ...form, stars: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
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
                  <label style={S.formLabel}>Beta (hidden by default)</label>
                  <textarea
                    style={S.formTextarea}
                    placeholder="Optional beta / spoiler…"
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
                {t('routeDetail.submitComment')}
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
                      return <span style={{ ...S.commentStatus, ...statusStyle }}>{c.user_status}</span>
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
                        Show beta
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

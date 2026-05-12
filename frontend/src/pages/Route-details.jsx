import { useEffect, useState, useRef } from "react"
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/client'

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
    marginTop: "1rem",
  },

  tagsRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "0.6rem",
  },

  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.2rem 0.5rem 0.2rem 0.6rem",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    background: "rgba(255,255,255,0.04)",
    transition: "border-color 0.15s",
  },

  tagRemoveBtn: {
    background: "none",
    border: "none",
    color: "var(--muted)",
    cursor: "pointer",
    fontSize: "0.75rem",
    padding: "0",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
  },

  addTagBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.2rem 0.6rem",
    border: "1px dashed var(--line)",
    color: "var(--muted)",
    background: "none",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },

  // ── TAG PANEL ──
  tagPanel: {
    background: "var(--granite)",
    border: "1px solid var(--line)",
    padding: "1rem 1.25rem",
    marginTop: "0.6rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.85rem",
  },

  tagPanelTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--hold)",
  },

  tagInputRow: {
    display: "flex",
    gap: "0.5rem",
  },

  tagInput: {
    flex: 1,
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    padding: "0.45rem 0.7rem",
    outline: "none",
    transition: "border-color 0.15s",
    minWidth: 0,
  },

  tagSubmitBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.45rem 0.9rem",
    background: "var(--hold)",
    color: "var(--chalk)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s",
    flexShrink: 0,
  },

  existingTagsLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "0.4rem",
  },

  existingTagsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
  },

  existingTagBtn: (assigned) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.2rem 0.55rem",
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

// ── Tag management panel ───────────────────────────────────────────────────────
function TagManager({ routeId, tags, onTagsChange }) {
  const [allTags, setAllTags] = useState([])
  const [newTagName, setNewTagName] = useState("")
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const inputRef = useRef()

  // Load all existing tags when panel opens
  useEffect(() => {
    if (open) {
      api.get("/tags").then(res => setAllTags(res.data.tags || []))
    }
  }, [open])

  const assignedIds = new Set(tags.map(t => t.id))

  const handleCreateAndAssign = async () => {
    const name = newTagName.trim().toLowerCase()
    if (!name) return
    // Step 1: create tag (returns existing if duplicate)
    const createRes = await api.post("/tags", { name })
    const tag = createRes.data.tag
    // Step 2: assign to route
    const assignRes = await api.post(`/routes/${routeId}/tags`, { tag_id: tag.id })
    onTagsChange(assignRes.data.tags)
    setNewTagName("")
    // Refresh all-tags list so the new one appears
    const tagsRes = await api.get("/tags")
    setAllTags(tagsRes.data.tags || [])
  }

  const handleAssignExisting = async (tagId) => {
    if (assignedIds.has(tagId)) return
    const res = await api.post(`/routes/${routeId}/tags`, { tag_id: tagId })
    onTagsChange(res.data.tags)
  }

  const handleRemove = async (tagId) => {
    const res = await api.delete(`/routes/${routeId}/tags/${tagId}`)
    onTagsChange(res.data.tags)
  }

  return (
    <div style={S.tagsSection}>
      <div style={S.tagsRow}>
        {tags.map(t => (
          <span key={t.id} style={S.tag}>
            {t.name}
            <button
              style={{
                ...S.tagRemoveBtn,
                color: hovered === `rm-${t.id}` ? "var(--hold-lt)" : "var(--muted)",
              }}
              title="Remove tag"
              onMouseEnter={() => setHovered(`rm-${t.id}`)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleRemove(t.id)}
            >
              ✕
            </button>
          </span>
        ))}
        <button
          style={{
            ...S.addTagBtn,
            borderColor: open ? "var(--hold)" : "var(--line)",
            color: open ? "var(--hold)" : "var(--muted)",
          }}
          onClick={() => {
            setOpen(v => !v)
            setTimeout(() => inputRef.current?.focus(), 50)
          }}
        >
          {open ? "Done" : "+ Tag"}
        </button>
      </div>

      {open && (
        <div style={S.tagPanel}>
          {/* Create new tag */}
          <div>
            <div style={S.tagPanelTitle}>Create & assign new tag</div>
            <div style={S.tagInputRow}>
              <input
                ref={inputRef}
                style={S.tagInput}
                type="text"
                placeholder="e.g. overhang, slab, crimpy…"
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleCreateAndAssign() }}
                onFocus={e => e.target.style.borderColor = "var(--hold)"}
                onBlur={e => e.target.style.borderColor = "var(--line)"}
              />
              <button
                style={{
                  ...S.tagSubmitBtn,
                  background: hovered === "create" ? "var(--hold-lt)" : "var(--hold)",
                }}
                onMouseEnter={() => setHovered("create")}
                onMouseLeave={() => setHovered(null)}
                onClick={handleCreateAndAssign}
              >
                Add
              </button>
            </div>
          </div>

          {/* Assign existing tags */}
          {allTags.length > 0 && (
            <div>
              <div style={S.existingTagsLabel}>Assign existing tag</div>
              <div style={S.existingTagsList}>
                {allTags.map(t => {
                  const assigned = assignedIds.has(t.id)
                  return (
                    <button
                      key={t.id}
                      style={{
                        ...S.existingTagBtn(assigned),
                        ...(hovered === `ex-${t.id}` && !assigned
                          ? { borderColor: "var(--chalk)", color: "var(--chalk)" }
                          : {}),
                      }}
                      disabled={assigned}
                      onMouseEnter={() => !assigned && setHovered(`ex-${t.id}`)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleAssignExisting(t.id)}
                      title={assigned ? "Already assigned" : `Assign "${t.name}"`}
                    >
                      {t.name}
                      {assigned && " ✓"}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function RouteDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const [route, setRoute] = useState(null)
  const [comments, setComments] = useState([])
  const [tags, setTags] = useState([])
  const [attempt, setAttempt] = useState(null)
  const [avgPerceivedGrade, setAvgPerceivedGrade] = useState(null)
  const [isProject, setIsProject] = useState(false)

  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ stars: "", perceived_grade: "!", body: "" })

  const [showEditForm, setShowEditForm] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", grade: "", length: "", route_index: "" })

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
      .then(res => setAttempt(res.data.attempt))
  }

  const toggleProject = () => {
    api.post(`/routes/${id}/project`)
      .then(res => setIsProject(res.data.is_project))
  }

  const submitComment = () => {
    const payload = { ...form }
    if (payload.perceived_grade === "!") payload.perceived_grade = route.grade
    api.post(`/routes/${id}/comments`, payload)
      .then(res => {
        setComments(prev => [res.data, ...prev])
        setShowForm(false)
        setForm({ stars: "", perceived_grade: "!", body: "" })
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
{/* NOTE: disabled for now, might be useful later */}
          {/* <TagManager */}
          {/*   routeId={id} */}
          {/*   tags={tags} */}
          {/*   onTagsChange={setTags} */}
          {/* /> */}

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
              onClick={() => setShowForm(p => !p)}
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
            comments.map(c => (
              <div key={c.id} style={S.commentItem}>
                <div style={S.commentHeader}>
                  <span style={{ ...S.commentUser, cursor: 'pointer' }} onClick={() => navigate(`/stats/${c.user_id}`)}>{c.username}</span>
                  <div style={S.commentMeta}>
                    {c.perceived_grade && (
                      <span style={S.commentGrade}>{c.perceived_grade}</span>
                    )}
                    <StarDisplay value={c.stars} />
                  </div>
                </div>
                {c.body && <p style={S.commentBody}>{c.body}</p>}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

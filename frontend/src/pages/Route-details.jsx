import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/client'

const S = {
  root: {
    minHeight: "100vh",
    background: "var(--rock)",
    padding: "3rem 2rem",
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
    fontSize: "3.5rem",
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

  // ── BACK LINK ──
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
  tagsRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginTop: "1rem",
  },

  tag: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.2rem 0.6rem",
    border: "1px solid var(--line)",
    color: "var(--muted)",
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
    border: `1px solid ${sent ? "#5a9e6f" : "var(--line)"}`,
  }),

  btnRow: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.25rem",
    flexWrap: "wrap",
  },

  // Primary action button
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

  // Ghost button
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

  // ── COMMENT ITEM ──────────────────────────────────────
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
  const n = Math.round(parseFloat(value) || 0)
  return (
    <span style={S.commentStars}>
      {"★".repeat(Math.max(0, Math.min(5, n)))}{"☆".repeat(Math.max(0, 5 - Math.min(5, n)))}
      {" "}{value}/5
    </span>
  )
}

export default function RouteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [route, setRoute] = useState(null)
  const [comments, setComments] = useState([])
  const [tags, setTags] = useState([])
  const [attempt, setAttempt] = useState(null)

  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ stars: "", perceived_grade: "!", body: "" })

  const [showEditForm, setShowEditForm] = useState(false)

  const [editForm, setEditForm] = useState({
    name: "",
    grade: "",
    length: "",
    route_index: "",
  })

  useEffect(() => {
    api.get(`/routes/${id}`)
      .then(res => {
        const d = res.data
        setRoute(d.route)
        setComments(d.comments)
        setTags(d.tags)
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
        LOADING…
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
          <span style={S.eyebrow}>Route</span>
          <h1 style={S.title}>{route.name}</h1>
          <div style={S.metaLine}>
            <span style={S.gradeBadge}>{route.grade}</span>
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

          {tags.length > 0 && (
            <div style={S.tagsRow}>
              {tags.map((t, i) => (
                <span key={i} style={S.tag}>{t.name}</span>
              ))}
            </div>
          )}
  		  <div style={S.btnRow}>
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
  		  	{showEditForm ? "Cancel Edit" : "Edit Route"}
  		    </button>
  		  </div>
			{showEditForm && (
			  <div style={{ ...S.card, marginTop: "1.5rem" }}>
				<div style={S.cardTitle}>Edit Route</div>

				<div style={S.formGrid}>
				  <div style={S.formField}>
					<label style={S.formLabel}>Name</label>
					<input
					  type="text"
					  style={S.formInput}
					  value={editForm.name}
					  onChange={e =>
						setEditForm({ ...editForm, name: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>Grade</label>
					<input
					  type="text"
					  style={S.formInput}
					  value={editForm.grade}
					  onChange={e =>
						setEditForm({ ...editForm, grade: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>Length (m)</label>
					<input
					  type="number"
					  style={S.formInput}
					  value={editForm.length}
					  onChange={e =>
						setEditForm({ ...editForm, length: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>Route Index</label>
					<input
					  type="number"
					  style={S.formInput}
					  value={editForm.route_index}
					  onChange={e =>
						setEditForm({ ...editForm, route_index: e.target.value })
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
					  hoveredBtn === "saveRoute"
						? "var(--hold-lt)"
						: "var(--hold)",
				  }}
				  onMouseEnter={() => setHoveredBtn("saveRoute")}
				  onMouseLeave={() => setHoveredBtn(null)}
				  onClick={submitRouteEdit}
				>
				  Save Changes
				</button>
			  </div>
			)}
        </div>

        {/* ── ATTEMPTS CARD ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>Attempts</div>

          <div style={S.attemptsRow}>
            <div>
              <div style={S.attemptStat}>{attemptCount}</div>
              <div style={S.attemptLabel}>
                {attemptCount === 1 ? "Attempt" : "Attempts"}
              </div>
            </div>

            <div style={{ width: "1px", height: "36px", background: "var(--line)", margin: "0 0.25rem" }} />

            <span style={S.sentBadge(isSent)}>
              {isSent ? "✓ Sent" : attemptCount > 0 ? "Working" : "Not attempted"}
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
              + Attempt
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
              ✓ Mark Sent
            </button>
          </div>
        </div>

        {/* ── COMMENTS CARD ── */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ ...S.cardTitle, marginBottom: 0 }}>
              Comments {comments.length > 0 && `(${comments.length})`}
            </div>
            <button
              style={{
                ...S.btnGhost,
                fontSize: "0.75rem",
                padding: "0.4rem 0.9rem",
                borderColor: showForm
                  ? "var(--hold)"
                  : hoveredBtn === "toggleForm"
                  ? "var(--hold)"
                  : "var(--line)",
                color: showForm
                  ? "var(--hold)"
                  : hoveredBtn === "toggleForm"
                  ? "var(--hold)"
                  : "var(--chalk)",
              }}
              onMouseEnter={() => setHoveredBtn("toggleForm")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={() => setShowForm(p => !p)}
            >
              {showForm ? "Cancel" : "+ Add Comment"}
            </button>
          </div>

          {/* Comment form */}
          {showForm && (
            <>
              <div style={S.formGrid}>
                <div style={S.formField}>
                  <label style={S.formLabel}>Stars (0 – 5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    style={S.formInput}
                    placeholder="e.g. 4"
                    value={form.stars}
                    onChange={e => setForm({ ...form, stars: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "var(--hold)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                </div>

                <div style={S.formField}>
                  <label style={S.formLabel}>Perceived Grade</label>
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
                  <label style={S.formLabel}>Comment</label>
                  <textarea
                    style={S.formTextarea}
                    placeholder="How did it feel? Any beta?"
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
                Submit Comment
              </button>

              <div style={S.divider} />
            </>
          )}

          {/* Comment list */}
          {comments.length === 0 ? (
            <p style={S.emptyComments}>No comments yet. Be the first!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={S.commentItem}>
                <div style={S.commentHeader}>
                  <span style={S.commentUser}>{c.username}</span>
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

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const S = {
  root: {
    minHeight: "100vh",
    background: "var(--rock)",
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "800px",
  },

  title: {
    fontSize: "2.2rem",
    marginBottom: "0.5rem",
  },

  meta: {
    color: "var(--muted)",
    marginBottom: "1rem",
  },

  tags: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },

  tag: {
    padding: "0.2rem 0.5rem",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    fontSize: "0.8rem",
  },

  section: {
    marginTop: "2rem",
  },

  button: {
    padding: "0.4rem 0.8rem",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "0.5rem",
    transition: "all 0.15s",
  },

  buttonHover: {
    border: "1px solid var(--hold)",
    color: "var(--hold)",
  },

  comment: {
    border: "1px solid var(--line)",
    borderRadius: "8px",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    background: "var(--granite)",
  },

  input: {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
  },
}

export default function RouteDetail() {
  const { id } = useParams()

  const [route, setRoute] = useState(null)
  const [comments, setComments] = useState([])
  const [tags, setTags] = useState([])
  const [attempt, setAttempt] = useState(null)

  const [hoveredBtn, setHoveredBtn] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    stars: "",
    perceived_grade: "!",
    body: "",
  })

  useEffect(() => {
    fetch(`/api/routes/${id}`)
      .then(res => res.json())
      .then(data => {
        const d = data
        setRoute(d.route)
        setComments(d.comments)
        setTags(d.tags)
		if (d.attempt.length == 0) setAttempt({ id:null, amount: 0, sent: false })
		else setAttempt(d.attempt)
      })
  }, [id])

  const addAttempt = () => {
    fetch(`/api/routes/${id}/add_attempt`)
      .then(res => res.json())
      .then(data => setAttempt(data))
  }

  const sendAttempt = () => {
    fetch(`/api/routes/${id}/sent_attempt`)
      .then(res => res.json())
      .then(data => setAttempt(data))
  }

  const submitComment = () => {
    fetch(`/api/routes/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        setComments(prev => [data, ...prev])
        setShowForm(false)
      })
  }

  if (!route) return <div style={S.root}>Loading...</div>

  return (
    <div style={S.root}>
      <div style={S.container}>
        <h1 style={S.title}>{route.name}</h1>
        <div style={S.meta}>
          {route.grade} — {route.topo_title} ({route.topo_location})
        </div>

        {/* TAGS */}
        <div style={S.tags}>
          {tags.map((t, i) => (
            <div key={i} style={S.tag}>{t.name}</div>
          ))}
        </div>

        {/* ATTEMPTS */}
        <div style={S.section}>
          <h3>Attempts</h3>
          <div>
            <button
              style={{
                ...S.button,
                ...(hoveredBtn === "attempt" ? S.buttonHover : {}),
              }}
              onMouseEnter={() => setHoveredBtn("attempt")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={addAttempt}
            >
              Add Attempt
            </button>

            <button
              style={{
                ...S.button,
                ...(hoveredBtn === "sent" ? S.buttonHover : {}),
              }}
              onMouseEnter={() => setHoveredBtn("sent")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={sendAttempt}
            >
              Sent
            </button>

            {attempt && (
              <span style={{ marginLeft: "1rem" }}>
                {attempt.amount > 0 ? attempt.amount + "attempts" : ""} {attempt.sent ? "(sent)" : attempt.amount > 0 ? "(working)" : "not attempted"}
              </span>
            )}
          </div>
        </div>

        {/* COMMENTS */}
        <div style={S.section}>
          <h3>Comments</h3>

          <button
            style={{
              ...S.button,
              ...(hoveredBtn === "comment" ? S.buttonHover : {}),
            }}
            onMouseEnter={() => setHoveredBtn("comment")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => setShowForm(!showForm)}
          >
            Add Comment
          </button>

          {showForm && (
            <div style={{ marginTop: "1rem" }}>
              <input type="number"
                style={S.input}
                placeholder="Stars (0-5)"
                value={form.stars}
                onChange={e => setForm({ ...form, stars: e.target.value })}
              />
              <input type="text"
                style={S.input}
                placeholder="Perceived grade"
                value={form.perceived_grade == "!" ? route.grade : form.perceived_grade}
                onChange={e => setForm({ ...form, perceived_grade: e.target.value })}
              />
              <textarea
                style={S.input}
                placeholder="Comment"
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
              />

              <button
                style={S.button}
                onClick={submitComment}
              >
                Submit
              </button>
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            {comments.map(c => (
              <div key={c.id} style={S.comment}>
                <strong>{c.username}</strong> — {c.stars}⭐
                <div>{c.perceived_grade}</div>
                <div>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

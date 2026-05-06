import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const S = {
  root: {
    minHeight: "100vh",
    background: "var(--rock)",
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  header: {
    width: "100%",
    maxWidth: "580px",
    marginBottom: "2.5rem",
  },

  eyebrow: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--muted)",
  },

  title: {
    fontSize: "2.2rem",
    margin: "0.5rem 0",
  },

  rule: {
    height: "2px",
    width: "60px",
    background: "var(--hold)",
  },

  list: {
    width: "100%",
    maxWidth: "580px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  item: {
    padding: "0.9rem 1.2rem",
    borderRadius: "10px",
    background: "var(--granite)",
    border: "1px solid var(--line)",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  itemHover: {
    background: "var(--line)",              // lighter than granite
    transform: "translateY(-2px)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
    border: "1px solid var(--hold)",        // strong accent
  },

  titleText: {
    fontWeight: "500",
  },

  location: {
    fontSize: "0.85rem",
    color: "var(--muted)",
    marginTop: "0.2rem",
  },

  empty: {
    color: "var(--muted)",
  },
}

export default function Topos() {
  const [topos, setTopos] = useState([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("/api/topos")
      .then(res => res.json())
      .then(data => {
        const list = data || []

        // optional safety sort
        list.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        )

        setTopos(list)
      })
      .catch(err => {
        console.error("Error fetching topos:", err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={S.root}>
      <div style={S.header}>
        <span style={S.eyebrow}>Library</span>
        <h1 style={S.title}>Topos</h1>
        <div style={S.rule} />
      </div>

      <div style={S.list}>
        {loading ? (
          <p style={S.empty}>Loading...</p>
        ) : topos.length === 0 ? (
          <p style={S.empty}>No topos available.</p>
        ) : (
          topos.map(topo => (
            <div
              key={topo.id}
              style={{
                ...S.item,
                ...(hovered === topo.id ? S.itemHover : {}),
              }}
              onMouseEnter={() => setHovered(topo.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate("/topos/" + topo.id)}
            >
              <div style={S.titleText}>{topo.title}</div>

              {topo.location && (
                <div style={S.location}>{topo.location}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

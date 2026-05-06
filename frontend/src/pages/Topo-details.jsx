import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

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
    maxWidth: "800px",
    marginBottom: "2rem",
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

  meta: {
    marginTop: "0.5rem",
    color: "var(--muted)",
  },

  toggleRow: {
    display: "flex",
    gap: "1rem",
    margin: "1.5rem 0",
  },

  button: {
    padding: "0.4rem 0.8rem",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    cursor: "pointer",
  },

  activeButton: {
    border: "1px solid var(--hold)",
    color: "var(--hold)",
  },

  section: {
    width: "100%",
    maxWidth: "800px",
  },

  histogramRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
    marginBottom: "0.5rem",
  },

  bar: {
    height: "12px",
    background: "var(--hold)",
    borderRadius: "4px",
  },

  gradeLabel: {
    width: "50px",
  },

  routeList: {
    marginLeft: "60px",
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },

  route: {
    cursor: "pointer",
    color: "var(--chalk)",
  },

  routeHover: {
    color: "var(--hold)",
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

  itemActive: {
    padding: "0.9rem 1.2rem",
    borderRadius: "10px",
    background: "var(--hold)",
    border: "1px solid var(--line)",
  },

}

const getGradeColor = (grade) => {
  const t = grade * grade / 30.0 / 30.0

  // interpolate hue: 120 (green) → 0 (red)
  const hue = 130 - 130 * t

  return `hsl(${hue}, 70%, 45%)`
}

export default function TopoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [topo, setTopo] = useState(null)
  const [routes, setRoutes] = useState([])
  const [view, setView] = useState("grades") // "grades" | "index"
  const [expandedGrades, setExpandedGrades] = useState({})
  const [hovered, setHovered] = useState(null)
  const [hoveredRoute, setHoveredRoute] = useState(null)

  useEffect(() => {
    fetch(`/api/topos/${id}`)
      .then(res => res.json())
      .then(data => {
        setTopo(data.topo)
        setRoutes(data.routes)
      })
      .catch(err => console.error(err))
  }, [id])

  if (!topo) {
    return (
      <div style={S.root}>
        <p>Loading...</p>
      </div>
    )
  }

  // group routes by grade
  const gradesMap = routes.reduce((acc, r) => {
    if (!acc[r.grade]) acc[r.grade] = []
    acc[r.grade].push(r)
    return acc
  }, {})

  const grades = Object.keys(gradesMap).sort()

  const maxCount = Math.max(...grades.map(g => gradesMap[g].length), 1)

  const toggleGrade = (g) => {
    setExpandedGrades(prev => ({
      ...prev,
      [g]: !prev[g],
    }))
  }

  return (
    <div style={S.root}>
      <div style={S.header}>
        <span style={S.eyebrow}>Topo</span>
        <h1 style={S.title}>{topo.title}</h1>
        <div style={S.rule} />
        {topo.location && <div style={S.meta}>{topo.location}</div>}
		<div style={{ marginTop: "1rem" }}>
		  <button
		    style={{
		      ...S.item,
		      ...(hovered === "download" ? S.itemHover : {}),
		    }}
		    onMouseEnter={() => setHovered("download")}
		    onMouseLeave={() => setHovered(null)}
			onClick={() => window.open(`/api/topos/${id}/download`, "_blank")}
		  >
			Download PDF
		  </button>
		</div>

      </div>

      {/* VIEW TOGGLE */}
      <div style={S.toggleRow}>
        <div
			style={{
                ...S.item,
                ...(hovered === "grades" ? S.itemHover : {}),
				...(view === "grades" ? S.itemActive : {}),
              }}
              onMouseEnter={() => setHovered("grades")}
              onMouseLeave={() => setHovered(null)}
			onClick={() => setView("grades")}
        >
          Grades
        </div>

        <div
		  style={{
			...S.item,
			...(hovered === "index" ? S.itemHover : {}),
			...(view === "index" ? S.itemActive : {}),
		  }}
		  onMouseEnter={() => setHovered("index")}
		  onMouseLeave={() => setHovered(null)}
		  onClick={() => setView("index")}
        >
          By Index
        </div>
      </div>

      <div style={S.section}>
        {/* GRADES VIEW */}
        {view === "grades" && (
          <>
            {grades.map(g => {
              const count = gradesMap[g].length
              const width = (count / maxCount) * 90

              return (
                <div key={g}>
                  <div
                    style={S.histogramRow}
                    onClick={() => toggleGrade(g)}
                  >
                    <div style={S.gradeLabel}>{g}</div>
                    <div
                      style={{
                        ...S.bar,
                        width: `${width}%`,
						background: getGradeColor(gradesMap[g][0].sorting_grade),
                      }}
                    />
                    <div>({count})</div>
                  </div>

                  {expandedGrades[g] && (
                    <div style={S.routeList}>
                      {gradesMap[g].map(route => (
                        <div
                          key={route.id}
                          style={{
                            ...S.route,
                            ...(hoveredRoute === route.id ? S.routeHover : {}),
                          }}
                          onMouseEnter={() => setHoveredRoute(route.id)}
                          onMouseLeave={() => setHoveredRoute(null)}
                          onClick={() => navigate("/routes/" + route.id)}
                        >
                          {route.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}

        {/* INDEX VIEW */}
        {view === "index" && (
          <div style={S.routeList}>
            {[...routes]
              .sort((a, b) => (a.route_index ?? 0) - (b.route_index ?? 0))
              .map(route => (
                <div
                  key={route.id}
                  style={{
                    ...S.route,
                    ...(hoveredRoute === route.id ? S.routeHover : {}),
                  }}
                  onMouseEnter={() => setHoveredRoute(route.id)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  onClick={() => navigate("/coming-soon")}
                >
                  #{route.route_index ?? "?"} — {route.name} ({route.grade})
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

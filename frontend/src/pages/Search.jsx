import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from '../api/client'

const getGradeColor = (grade) => {
  if (grade < 0) return 'hsl(0, 0%, 50%)'
  const stops = [
    [0,    105, 55, 48],
    [11.5,  88, 60, 46],
    [17.5,  65, 70, 46],
    [19.5,  45, 75, 48],
    [21.5,  30, 78, 46],
    [23.5,  18, 80, 45],
    [25.5,   6, 82, 44],
    [27.5, 352, 80, 42],
    [29.5, 330, 75, 38],
    [35,   285, 70, 32],
  ]

  if (grade <= stops[0][0]) return `hsl(${stops[0][1]}, ${stops[0][2]}%, ${stops[0][3]}%)`
  if (grade >= stops[stops.length - 1][0]) {
    const s = stops[stops.length - 1]
    return `hsl(${s[1]}, ${s[2]}%, ${s[3]}%)`
  }

  let lo, hi
  for (let i = 0; i < stops.length - 1; i++) {
    if (grade >= stops[i][0] && grade <= stops[i + 1][0]) {
      lo = stops[i]; hi = stops[i + 1]; break
    }
  }

  const t = (grade - lo[0]) / (hi[0] - lo[0])
  let dh = hi[1] - lo[1]
  if (dh > 180) dh -= 360
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

  vertRule: {
    position: "fixed",
    left: "12vw",
    top: 0,
    bottom: 0,
    width: "1px",
    background: "var(--line)",
    opacity: 0.6,
    zIndex: 0,
  },

  container: {
    width: "100%",
    maxWidth: "720px",
    position: "relative",
    zIndex: 1,
  },

  // ── HEADER ──
  header: {
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
    fontSize: "4rem",
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

  // ── SEARCH BAR ──
  searchWrap: {
    position: "relative",
    margin: "2rem 0 2.5rem",
  },

  searchIcon: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--muted)",
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1rem",
    pointerEvents: "none",
    letterSpacing: 0,
  },

  searchInput: {
    width: "100%",
    background: "var(--granite)",
    border: "1px solid var(--line)",
    borderLeft: "4px solid var(--hold)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "1.1rem",
    fontWeight: 300,
    padding: "0.85rem 3rem 0.85rem 2.75rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },

  clearBtn: {
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--muted)",
    cursor: "pointer",
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.1rem",
    padding: "0",
    lineHeight: 1,
    transition: "color 0.15s",
  },

  // ── RESULTS LAYOUT ──
  results: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
    alignItems: "start",
  },

  // ── COLUMN ──
  column: {
    display: "flex",
    flexDirection: "column",
  },

  columnHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.6rem",
    marginBottom: "0.75rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid var(--line)",
  },

  columnTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--hold)",
  },

  columnCount: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "var(--muted)",
  },

  // ── TOPO ROW ──
  topoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.7rem 0",
    borderBottom: "1px solid var(--line)",
    cursor: "pointer",
    gap: "0.75rem",
  },

  topoName: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    transition: "color 0.15s",
    flex: 1,
    lineHeight: 1.2,
  },

  topoLocation: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.75rem",
    color: "var(--muted)",
    marginTop: "0.15rem",
  },

  // ── ROUTE ROW ──
  routeRow: {
    display: "flex",
    alignItems: "center",
    padding: "0.7rem 0",
    borderBottom: "1px solid var(--line)",
    cursor: "pointer",
    gap: "0.6rem",
  },

  routeGrade: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    padding: "0.15rem 0.45rem",
    flexShrink: 0,
    color: "var(--chalk)",
  },

  routeName: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    color: "var(--chalk)",
    flex: 1,
    transition: "color 0.15s",
    lineHeight: 1.2,
  },

  routeTopo: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginTop: "0.1rem",
  },

  rowArrow: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1rem",
    color: "var(--line)",
    flexShrink: 0,
    transition: "color 0.15s, transform 0.15s",
  },

  rowArrowHover: {
    color: "var(--hold)",
    transform: "translateX(3px)",
  },

  // ── STATES ──
  emptyState: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 0",
    gap: "0.5rem",
  },

  emptyTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)",
  },

  emptyHint: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.82rem",
    color: "var(--muted)",
    opacity: 0.6,
  },

  promptState: {
    gridColumn: "1 / -1",
    padding: "3rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },

  promptLine: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--line)",
  },
}

export default function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(null)   // null = not yet searched
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(null)
  const inputRef = useRef()
  const navigate = useNavigate()

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  // Search whenever query changes and has ≥3 chars
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      api.get(`/search?q=${encodeURIComponent(query)}`)
        .then(res => setResults(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }, 180) // small debounce to avoid firing on every keystroke

    return () => clearTimeout(timeout)
  }, [query])

  const hasResults = results && (results.routes?.length > 0 || results.topos?.length > 0)
  const noResults  = results && !hasResults

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.vertRule} />

      <div style={S.container}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>Library</span>
          <h1 style={S.title}>Search</h1>
          <div style={S.titleUnderline} />
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>⌕</span>
          <input
            ref={inputRef}
            style={S.searchInput}
            type="text"
            placeholder="Route name, topo…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = "var(--hold)"
              e.target.style.boxShadow = "0 0 0 1px var(--hold)"
            }}
            onBlur={e => {
              e.target.style.borderColor = "var(--line)"
              e.target.style.boxShadow = "none"
            }}
          />
          {query && (
            <button
              style={{
                ...S.clearBtn,
                color: hovered === "clear" ? "var(--chalk)" : "var(--muted)",
              }}
              onMouseEnter={() => setHovered("clear")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { setQuery(""); setResults(null); inputRef.current?.focus() }}
            >
              ✕
            </button>
          )}
        </div>

        {/* ── RESULTS ── */}
        <div style={S.results}>

          {/* Prompt — nothing typed yet */}
          {!query && (
            <div style={S.promptState}>
              <p style={S.promptLine}>Searches routes and topos</p>
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div style={S.emptyState}>
              <span style={S.emptyTitle}>No results for "{query}"</span>
              <span style={S.emptyHint}>Try a different spelling or shorter term</span>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <>
              {/* TOPOS COLUMN */}
              <div style={S.column}>
                <div style={S.columnHeader}>
                  <span style={S.columnTitle}>Topos</span>
                  <span style={S.columnCount}>{results.topos.length} result{results.topos.length !== 1 ? "s" : ""}</span>
                </div>

                {results.topos.length === 0 ? (
                  <span style={{ ...S.emptyHint, padding: "0.75rem 0" }}>No topos found</span>
                ) : (
                  results.topos.map(topo => (
                    <div
                      key={topo.id}
                      style={{
                        ...S.topoRow,
                        background: hovered === `topo-${topo.id}` ? "rgba(255,255,255,0.02)" : "transparent",
                      }}
                      onMouseEnter={() => setHovered(`topo-${topo.id}`)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => navigate(`/topos/${topo.id}`)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          ...S.topoName,
                          color: hovered === `topo-${topo.id}` ? "var(--hold-lt)" : "var(--chalk)",
                        }}>
                          {topo.title}
                        </div>
                        {topo.location && (
                          <div style={S.topoLocation}>{topo.location}</div>
                        )}
                      </div>
                      <span style={{
                        ...S.rowArrow,
                        ...(hovered === `topo-${topo.id}` ? S.rowArrowHover : {}),
                      }}>›</span>
                    </div>
                  ))
                )}
              </div>

              {/* ROUTES COLUMN */}
              <div style={S.column}>
                <div style={S.columnHeader}>
                  <span style={S.columnTitle}>Routes</span>
                  <span style={S.columnCount}>{results.routes.length} result{results.routes.length !== 1 ? "s" : ""}</span>
                </div>

                {results.routes.length === 0 ? (
                  <span style={{ ...S.emptyHint, padding: "0.75rem 0" }}>No routes found</span>
                ) : (
                  results.routes.map(route => (
                    <div
                      key={route.id}
                      style={{
                        ...S.routeRow,
                        background: hovered === `route-${route.id}` ? "rgba(255,255,255,0.02)" : "transparent",
                      }}
                      onMouseEnter={() => setHovered(`route-${route.id}`)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => navigate(`/routes/${route.id}`)}
                    >
                      {route.grade && (
                        <span style={{
                          ...S.routeGrade,
                          background: getGradeColor(route.sorting_grade),
                        }}>
                          {route.grade}
                        </span>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          ...S.routeName,
                          color: hovered === `route-${route.id}` ? "var(--hold-lt)" : "var(--chalk)",
                        }}>
                          {route.name}
                        </div>
                      </div>
                      <span style={{
                        ...S.rowArrow,
                        ...(hovered === `route-${route.id}` ? S.rowArrowHover : {}),
                      }}>›</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

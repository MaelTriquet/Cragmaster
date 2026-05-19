import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
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
  return `hsl(${(lo[1]+dh*t).toFixed(1)}, ${(lo[2]+(hi[2]-lo[2])*t).toFixed(1)}%, ${(lo[3]+(hi[3]-lo[3])*t).toFixed(1)}%)`
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

  // ── SEARCH BAR ──
  searchWrap: {
    position: "relative",
    margin: "2rem 0 0.75rem",
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

  // ── TAG MENU ──
  tagMenuWrap: {
    position: "relative",
  },

  tagMenuBtn: (active) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.25rem 0.65rem",
    border: `1px solid ${active ? "var(--hold)" : "var(--line)"}`,
    color: active ? "var(--chalk)" : "var(--muted)",
    background: active ? "rgba(200,80,42,0.18)" : "transparent",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s, background 0.15s",
  }),

  tagDropdown: {
    position: "absolute",
    top: "calc(100% + 0.4rem)",
    left: 0,
    width: "min(340px, 90vw)",
    background: "var(--granite)",
    border: "1px solid var(--line)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
  },

  tagDropdownSearch: {
    width: "100%",
    background: "var(--rock)",
    border: "none",
    borderBottom: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.85rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    boxSizing: "border-box",
    flex: "none",
  },

  tagDropdownBody: {
    overflowY: "auto",
    padding: "0.5rem 0",
    maxHeight: "240px",
  },

  tagDropdownCat: {
    padding: "0.3rem 0.75rem 0.15rem",
  },

  tagDropdownCatLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--hold)",
    marginBottom: "0.25rem",
  },

  tagDropdownTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.3rem",
  },

  tagDropdownChip: (active) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.15rem 0.45rem",
    border: `1px solid ${active ? "var(--hold)" : "var(--line)"}`,
    color: active ? "var(--chalk)" : "var(--muted)",
    background: active ? "rgba(200,80,42,0.18)" : "transparent",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s, background 0.15s",
  }),

  tagDropdownClear: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    border: "none",
    borderTop: "1px solid var(--line)",
    color: "var(--hold-lt)",
    background: "var(--rock)",
    cursor: "pointer",
    padding: "0.5rem",
    flex: "none",
  },

  // ── FILTER SELECT ──
  filterSelect: (active) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.25rem 0.5rem",
    border: `1px solid ${active ? "var(--hold)" : "var(--line)"}`,
    color: active ? "var(--chalk)" : "var(--muted)",
    background: active ? "rgba(200,80,42,0.18)" : "transparent",
    cursor: "pointer",
    outline: "none",
    appearance: "auto",
    transition: "border-color 0.15s, color 0.15s, background 0.15s",
  }),

  // ── RESULTS LAYOUT ──
  results: {
    display: "grid",
    gridTemplateColumns: "var(--grid-2col, 1fr 1fr)",
    gap: "2rem",
    alignItems: "start",
  },

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

const CATEGORY_ORDER = ['route_style', 'hold', 'approche', 'exposure', 'style', 'other']

const GRADE_OPTIONS = []
for (let n = 3; n <= 9; n++) {
  for (const l of ['a', 'b', 'c']) {
    GRADE_OPTIONS.push({ label: `${n}${l}`, sort: GRADE_OPTIONS.length })
    GRADE_OPTIONS.push({ label: `${n}${l}+`, sort: GRADE_OPTIONS.length })
  }
}

export default function Search() {
  const [query, setQuery]               = useState("")
  const [results, setResults]           = useState(null)
  const [loading, setLoading]           = useState(false)
  const [hovered, setHovered]           = useState(null)
  const [allTags, setAllTags]           = useState([])
  const [activeTags, setActiveTags]     = useState(new Set())
  const [projectsOnly, setProjectsOnly] = useState(false)
  const [tagMenuOpen, setTagMenuOpen]   = useState(false)
  const [tagSearch, setTagSearch]       = useState("")
  const [gradeMin, setGradeMin]         = useState("")
  const [gradeMax, setGradeMax]         = useState("")

  const inputRef = useRef()
  const menuRef = useRef()
  const { t, i18n } = useTranslation()
  const tagName = (tag) => (i18n.language === 'fr' && tag.name_fr ? tag.name_fr : tag.name)
  const navigate = useNavigate()

  // Close tag menu on click outside
  useEffect(() => {
    if (!tagMenuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setTagMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [tagMenuOpen])

  // Auto-focus on mount + load all tags
  useEffect(() => {
    inputRef.current?.focus()
    api.get("/tags")
      .then(res => setAllTags(res.data.tags || []))
      .catch(() => {})
  }, [])

  // Re-search whenever query, active tags, or grade range change
  useEffect(() => {
    const hasQuery = query.length > 0
    const hasTags  = activeTags.size > 0
    const hasGrade = gradeMin !== "" || gradeMax !== ""

    if (!hasQuery && !hasTags && !hasGrade && !projectsOnly) {
      setResults(null)
      return
    }

    const timeout = setTimeout(() => {
      setLoading(true)
      const params = new URLSearchParams()
      if (query) params.set("q", query)
      if (projectsOnly) params.set("projects_only", "1")
      activeTags.forEach(id => params.append("tag_ids", id))
      if (gradeMin !== "") params.set("grade_min_sort", GRADE_OPTIONS.find(g => g.label === gradeMin)?.sort ?? "")
      if (gradeMax !== "") params.set("grade_max_sort", GRADE_OPTIONS.find(g => g.label === gradeMax)?.sort ?? "")

      api.get(`/search?${params.toString()}`)
        .then(res => setResults(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }, 180)

    return () => clearTimeout(timeout)
  }, [query, activeTags, projectsOnly, gradeMin, gradeMax])

  const toggleTag = (id) => {
    setActiveTags(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const hasQuery   = query.length > 0
  const hasTags    = activeTags.size > 0
  const hasGrade   = gradeMin !== "" || gradeMax !== ""
  const hasResults = results && (results.routes?.length > 0 || results.topos?.length > 0)
  const noResults  = results && !hasResults
  const showPrompt = !hasQuery && !hasTags && !hasGrade && !projectsOnly

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.vertRule} />

      <div style={S.container}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{t('search.eyebrow')}</span>
          <h1 style={S.title}>{t('search.title')}</h1>
          <div style={S.titleUnderline} />
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>⌕</span>
          <input
            ref={inputRef}
            style={S.searchInput}
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = "var(--hold)"
              e.target.style.boxShadow   = "0 0 0 1px var(--hold)"
            }}
            onBlur={e => {
              e.target.style.borderColor = "var(--line)"
              e.target.style.boxShadow   = "none"
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
              onClick={() => { setQuery(""); inputRef.current?.focus() }}
            >
              ✕
            </button>
          )}
        </div>

        {/* ── FILTERS ROW ── */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
          <button
            style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.25rem 0.65rem",
              border: `1px solid ${projectsOnly ? "var(--hold)" : "var(--line)"}`,
              color: projectsOnly ? "var(--chalk)" : "var(--muted)",
              background: projectsOnly ? "rgba(200,80,42,0.18)" : "transparent",
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s, background 0.15s",
            }}
            onClick={() => setProjectsOnly(v => !v)}
            onMouseEnter={e => { if (!projectsOnly) { e.target.style.borderColor = "var(--chalk)"; e.target.style.color = "var(--chalk)" }}}
            onMouseLeave={e => { if (!projectsOnly) { e.target.style.borderColor = "var(--line)"; e.target.style.color = "var(--muted)" }}}
          >
            {projectsOnly ? "\u2605" : "\u2606"} {t('search.projects')}
          </button>

          {/* ── TAGS ── */}
          <div style={S.tagMenuWrap} ref={menuRef}>
          <button
            style={S.tagMenuBtn(activeTags.size > 0)}
            onClick={() => setTagMenuOpen(v => !v)}
            onMouseEnter={e => { if (activeTags.size === 0) { e.target.style.borderColor = "var(--chalk)"; e.target.style.color = "var(--chalk)" }}}
            onMouseLeave={e => { if (activeTags.size === 0) { e.target.style.borderColor = "var(--line)"; e.target.style.color = "var(--muted)" }}}
          >
            {t('tags.title')} {activeTags.size > 0 && `(${activeTags.size})`}
          </button>

          {tagMenuOpen && (
            <div style={S.tagDropdown}>
              <input
                style={S.tagDropdownSearch}
                type="text"
                placeholder={t('tags.searchPlaceholder')}
                value={tagSearch}
                onChange={e => setTagSearch(e.target.value)}
                onFocus={e => e.target.style.background = "var(--granite)"}
                onBlur={e => e.target.style.background = "var(--rock)"}
                autoFocus
              />
              <div style={S.tagDropdownBody}>
                {CATEGORY_ORDER.map(cat => {
                  const catTags = allTags.filter(t => (t.category || 'other') === cat)
                  const catLabel = t(`tags.category_${cat}`).toLowerCase()
                  const search = tagSearch.toLowerCase()
                  const matched = search === ""
                    ? true
                    : catLabel.includes(search) || catTags.some(t => t.name.toLowerCase().includes(search))
                  if (!matched) return null
                  const filtered = search
                    ? catTags.filter(t => t.name.toLowerCase().includes(search) || catLabel.includes(search))
                    : catTags
                  if (filtered.length === 0 && !catLabel.includes(search)) return null
                  return (
                    <div key={cat} style={S.tagDropdownCat}>
                      <div style={S.tagDropdownCatLabel}>{t(`tags.category_${cat}`)}</div>
                      <div style={S.tagDropdownTags}>
                        {catTags.map(tg => {
                          const active = activeTags.has(tg.id)
                          if (search && !tg.name.toLowerCase().includes(search) && !catLabel.includes(search)) return null
                          return (
                            <button
                              key={tg.id}
                              style={{
                                ...S.tagDropdownChip(active),
                                ...(hovered === `stag-${tg.id}` && !active
                                  ? { borderColor: "var(--chalk)", color: "var(--chalk)" }
                                  : {}),
                              }}
                              onMouseEnter={() => setHovered(`stag-${tg.id}`)}
                              onMouseLeave={() => setHovered(null)}
                              onClick={() => toggleTag(tg.id)}
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
                  <div style={{ padding: "0.75rem", fontFamily: "Barlow, sans-serif", fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic" }}>
                    No tags loaded
                  </div>
                )}
              </div>
              {activeTags.size > 0 && (
                <button
                  style={S.tagDropdownClear}
                  onClick={() => { setActiveTags(new Set()); setTagMenuOpen(false) }}
                >
                  Clear filters ({activeTags.size})
                </button>
              )}
            </div>
          )}
        </div>

          {/* ── GRADE RANGE ── */}
          <select
            style={S.filterSelect(gradeMin !== "")}
            value={gradeMin}
            onChange={e => setGradeMin(e.target.value)}
          >
            <option value="">Min grade</option>
            {GRADE_OPTIONS.map(g => (
              <option key={g.label} value={g.label}>{g.label}</option>
            ))}
          </select>
          <span style={{ fontFamily: "Barlow, sans-serif", fontSize: "0.8rem", color: "var(--muted)" }}>–</span>
          <select
            style={S.filterSelect(gradeMax !== "")}
            value={gradeMax}
            onChange={e => setGradeMax(e.target.value)}
          >
            <option value="">Max grade</option>
            {GRADE_OPTIONS.map(g => (
              <option key={g.label} value={g.label}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* ── RESULTS ── */}
        <div style={S.results}>

          {showPrompt && (
            <div style={S.promptState}>
              <p style={S.promptLine}>{t('search.prompt')}</p>
            </div>
          )}

          {noResults && (
            <div style={S.emptyState}>
              <span style={S.emptyTitle}>
                {t('search.noResults')}
                {query && t('search.noResultsQuery', { query })}
                {hasTags && t('search.noResultsTags')}
              </span>
              <span style={S.emptyHint}>{t('search.tryDifferent')}</span>
            </div>
          )}

          {hasResults && (
            <>
              {/* TOPOS COLUMN — only shown when text query is present */}
              {results.topos.length > 0 && (
                <div style={S.column}>
                  <div style={S.columnHeader}>
                    <span style={S.columnTitle}>{t('search.topos')}</span>
                    <span style={S.columnCount}>{t('search.result', { count: results.topos.length })}</span>
                  </div>
                  {results.topos.map(topo => (
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
                  ))}
                </div>
              )}

              {/* ROUTES COLUMN — full width when no topos */}
              {results.routes.length > 0 && (
                <div style={{
                  ...S.column,
                  gridColumn: results.topos.length === 0 ? "1 / -1" : "auto",
                }}>
                  <div style={S.columnHeader}>
                    <span style={S.columnTitle}>{t('search.routes')}</span>
                    <span style={S.columnCount}>{t('search.result', { count: results.routes.length })}</span>
                    {hasTags && (
                      <span style={{
                        fontFamily: "Barlow Condensed, sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--hold)",
                        marginLeft: "auto",
                      }}>
                        {activeTags.size} {t('search.tagsActive', { count: activeTags.size })}
                      </span>
                    )}
                  </div>
                  {results.routes.map(route => (
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
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

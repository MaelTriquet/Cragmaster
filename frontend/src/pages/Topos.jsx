import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import api from '../api/client'
import { getOfflineTopoIds, getOfflineTopo, getConnectionStatus, isOnline, ping } from '../lib/offline'

const highlightMatch = (text, matchPos, matchLen) => {
  if (matchPos == null || matchLen === 0) return text
  const before = text.slice(0, matchPos)
  const match = text.slice(matchPos, matchPos + matchLen)
  const after = text.slice(matchPos + matchLen)
  return (
    <>
      {before}
      <span style={{ color: 'var(--hold)' }}>{match}</span>
      {after}
    </>
  )
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

  // ── TOOLBAR ──
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    gap: "1rem",
  },

  countPill: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
  },

  uploadBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.5rem 1.1rem",
    cursor: "pointer",
    background: "var(--hold)",
    color: "var(--chalk)",
    border: "none",
    transition: "background 0.15s",
  },

  // ── LIST ──
  list: {
    display: "flex",
    flexDirection: "column",
  },

  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 0",
    borderBottom: "1px solid var(--line)",
    cursor: "pointer",
    gap: "1rem",
    transition: "background 0.1s",
  },

  itemLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    flex: 1,
  },

  itemTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.15rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    transition: "color 0.15s",
  },

  itemLocation: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.82rem",
    fontWeight: 300,
    color: "var(--muted)",
  },

  itemArrow: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.1rem",
    color: "var(--line)",
    flexShrink: 0,
    transition: "color 0.15s, transform 0.15s",
  },

  itemArrowHover: {
    color: "var(--hold)",
    transform: "translateX(3px)",
  },

  // ── STATES ──
  stateText: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)",
    padding: "2rem 0",
  },

  emptyState: {
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

  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },

  // ── PROMPT STATE ──
  promptState: {
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

const TOPO_CATEGORIES = ['approach', 'exposure']

export default function Topos() {
  const [topos, setTopos] = useState([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const [query, setQuery] = useState("")
  const [allTags, setAllTags] = useState([])
  const [activeTags, setActiveTags] = useState(new Set())
  const [tagMenuOpen, setTagMenuOpen] = useState(false)
  const [tagSearch, setTagSearch] = useState("")
  const [searching, setSearching] = useState(false)
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef()
  const menuRef = useRef()
  const tagName = (tag) => (i18n.language === 'fr' && tag.name_fr ? tag.name_fr : tag.name)

  const hasQuery = query.trim().length > 0
  const hasTags  = activeTags.size > 0
  const isFiltering = hasQuery || hasTags

  // Load tags on mount
  useEffect(() => {
    api.get("/tags")
      .then(res => setAllTags(res.data.tags || []))
      .catch(() => {})
  }, [])

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

  // Load topos (normal list or search)
  useEffect(() => {
    if (!isFiltering) {
      loadAllTopos()
      return
    }
    const timeout = setTimeout(() => searchTopos(), 180)
    return () => clearTimeout(timeout)
  }, [query, activeTags])

  async function loadAllTopos() {
    setSearching(false)
    setLoading(true)
    if (getConnectionStatus() === 0) await ping()
    if (!isOnline()) {
      await loadCachedTopos()
      setLoading(false)
      return
    }
    try {
      const res = await api.get("/topos")
      let list = res.data || []
      list.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }))
      setTopos(list)
      setOfflineMode(false)
    } catch {
      await loadCachedTopos()
    }
    setLoading(false)
  }

  async function loadCachedTopos() {
    const ids = await getOfflineTopoIds()
    if (ids.length > 0) {
      const cached = []
      for (const id of ids) {
        const data = await getOfflineTopo(id)
        if (data?.topo) cached.push(data.topo)
      }
      cached.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }))
      setTopos(cached)
      setOfflineMode(true)
    } else {
      setTopos([])
    }
  }

  async function searchTopos() {
    setSearching(true)
    setLoading(true)
    if (getConnectionStatus() === 0) await ping()
    if (!isOnline()) {
      const ids = await getOfflineTopoIds()
      const cached = []
      for (const id of ids) {
        const data = await getOfflineTopo(id)
        if (data?.topo) cached.push(data.topo)
      }
      const q = query.toLowerCase().trim().replace(/ /g, '-')
      const filtered = cached.filter(t => !q || t.title.toLowerCase().includes(q))
      setTopos(filtered)
      setOfflineMode(true)
      setLoading(false)
      return
    }
    const params = new URLSearchParams()
    if (hasQuery) params.set("q", query.trim().replace(/ /g, '-'))
    activeTags.forEach(id => params.append("tag_ids", id))
    try {
      const res = await api.get(`/search?${params.toString()}`)
      setTopos(res.data.topos || [])
      setOfflineMode(false)
    } catch {
      setTopos([])
    }
    setLoading(false)
  }

  const toggleTag = (id) => {
    setActiveTags(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const topoLevelTags = allTags.filter(t => TOPO_CATEGORIES.includes(t.category || 'other'))

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{t('topos.eyebrow')}</span>
          <h1 style={S.title}>{t('topos.title')}</h1>
          <div style={S.titleUnderline} />
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>⌕</span>
          <input
            ref={inputRef}
            style={S.searchInput}
            type="text"
            placeholder={t('topos.searchPlaceholder')}
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

        {/* ── FILTERS ── */}
        <div style={S.headerRow}>
          {/* ── TOPO-LEVEL TAGS ── */}
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
                  {TOPO_CATEGORIES.map(cat => {
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
                  {topoLevelTags.length === 0 && (
                    <div style={{ padding: "0.75rem", fontFamily: "Barlow, sans-serif", fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic" }}>
                      {t('topos.noTagsAvailable')}
                    </div>
                  )}
                </div>
                {activeTags.size > 0 && (
                  <button
                    style={S.tagDropdownClear}
                    onClick={() => { setActiveTags(new Set()); setTagMenuOpen(false) }}
                  >
                    {t('topos.clearFilters', { count: activeTags.size })}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        {!isFiltering && (
          <div style={S.toolbar}>
            <span style={S.countPill}>
              {loading ? "—" : (topos.length < 2 ? t('topos.count', { count: topos.length }) : t('topos.count_plural', { count: topos.length }))}
            </span>
            <button
              style={{
                ...S.uploadBtn,
                background: hovered === "upload" ? "var(--hold-lt)" : "var(--hold)",
              }}
              onMouseEnter={() => setHovered("upload")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate("/upload")}
            >
              {t('topos.upload')}
            </button>
          </div>
        )}

        {offlineMode && (
          <div style={{
            textAlign: 'center',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--good)',
            border: '1px solid var(--good)',
            background: 'rgba(120,180,80,0.08)',
          }}>
            {t('topos.offlineBanner')}
          </div>
        )}

        {/* ── PROMPT STATE when searching ── */}
        {isFiltering && loading && (
          <p style={S.stateText}>{t('topos.loading')}</p>
        )}

        {isFiltering && !loading && topos.length === 0 && (
          <div style={S.emptyState}>
            <span style={S.emptyTitle}>{t('topos.noResults')}</span>
            <span style={S.emptyHint}>{t('topos.tryDifferent')}</span>
          </div>
        )}

        {/* ── LIST ── */}
        <div style={S.list}>
          {(!isFiltering || (isFiltering && !loading)) && topos.length > 0 ? (
            topos.map((topo, i) => (
              <div
                key={topo.id}
                style={{
                  ...S.item,
                  borderTop: i === 0 ? "1px solid var(--line)" : "none",
                  background: hovered === topo.id
                    ? "rgba(255,255,255,0.02)"
                    : "transparent",
                }}
                onMouseEnter={() => setHovered(topo.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate("/topos/" + topo.id)}
              >
                <div style={S.itemLeft}>
                  <span style={{
                    ...S.itemTitle,
                    ...(hovered === topo.id ? { color: "var(--hold-lt)" } : {}),
                  }}>
                    {hasQuery ? highlightMatch(topo.title, topo.match_pos, query.trim().length) : topo.title}
                  </span>
                  {topo.location && (
                    <span style={S.itemLocation}>{topo.location}</span>
                  )}
                </div>
                <span style={{
                  ...S.itemArrow,
                  ...(hovered === topo.id ? S.itemArrowHover : {}),
                }}>
                  ›
                </span>
              </div>
            ))
          ) : (!isFiltering && !loading && topos.length === 0) ? (
            <p style={S.stateText}>{t('topos.empty')}</p>
          ) : (!isFiltering && loading) ? (
            <p style={S.stateText}>{t('topos.loading')}</p>
          ) : null}
        </div>

      </div>
    </div>
  )
}

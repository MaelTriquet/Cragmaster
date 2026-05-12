import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/client'

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },

  noise: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: '128px',
    pointerEvents: 'none',
    opacity: 0.5,
    zIndex: 0,
  },

  header: {
    padding: 'var(--page-padding) 1rem',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },

  titleBlock: {
    borderLeft: '4px solid var(--hold)',
    paddingLeft: '1.25rem',
  },

  eyebrow: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'var(--hold)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.3rem',
  },

  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--title-2xl)',
    fontWeight: 800,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: 0,
    lineHeight: 0.95,
  },

  legend: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  legendDot: color => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
    border: '2px solid rgba(255,255,255,0.2)',
  }),

  mapWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
    margin: 'var(--map-margin, 0 2rem 2rem)',
    border: '1px solid var(--line)',
    minHeight: '500px',
  },

  mapEl: {
    width: '100%',
    height: '100%',
    minHeight: '500px',
  },

  countBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 500,
    background: 'rgba(26,26,24,0.92)',
    border: '1px solid var(--line)',
    backdropFilter: 'blur(8px)',
    padding: '0.5rem 0.85rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    pointerEvents: 'none',
  },

  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--granite)',
    zIndex: 10,
  },

  loadingText: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  emptyState: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    pointerEvents: 'none',
  },

  emptyTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  emptyHint: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    opacity: 0.6,
  },

  // ── Context menu ──────────────────────────────────────────────────────────
  ctxMenu: (x, y) => ({
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 2000,
    background: '#1a1a18',
    border: '1px solid #3a3a34',
    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
    minWidth: '240px',
    maxWidth: '300px',
    userSelect: 'none',
  }),

  ctxHeader: {
    padding: '0.45rem 0.85rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--hold)',
    borderBottom: '1px solid #3a3a34',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ctxCoords: {
    fontFamily: 'monospace',
    fontSize: '0.6rem',
    color: 'var(--muted)',
    fontWeight: 400,
    letterSpacing: 0,
    textTransform: 'none',
  },

  ctxSection: {
    padding: '0.3rem 0',
    borderBottom: '1px solid #2a2a28',
  },

  ctxSectionLabel: {
    padding: '0.3rem 0.85rem 0.15rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.58rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  ctxItem: hovered => ({
    padding: '0.45rem 0.85rem 0.45rem 1.2rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: hovered ? '#f0ede6' : '#b0aca4',
    background: hovered ? 'rgba(200,80,42,0.18)' : 'transparent',
    cursor: 'pointer',
    transition: 'background 0.1s, color 0.1s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    borderLeft: hovered ? '2px solid var(--hold)' : '2px solid transparent',
  }),

  ctxEmpty: {
    padding: '0.4rem 0.85rem 0.4rem 1.2rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    letterSpacing: '0.06em',
    color: '#4a4a44',
    fontStyle: 'italic',
  },

  ctxDismiss: {
    padding: '0.4rem 0.85rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#4a4a44',
    cursor: 'pointer',
    textAlign: 'right',
  },

  // ── Toast ─────────────────────────────────────────────────────────────────
  toast: visible => ({
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: `translateX(-50%) translateY(${visible ? 0 : '12px'})`,
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.25s, transform 0.25s',
    zIndex: 3000,
    background: '#2e2e2a',
    border: '1px solid var(--line)',
    borderLeft: '3px solid var(--hold)',
    padding: '0.65rem 1.2rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function makeIcon(color, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
            fill="${color}" stroke="rgba(0,0,0,0.35)" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="7" fill="rgba(0,0,0,0.25)"/>
      <text x="16" y="20" text-anchor="middle"
            font-family="'Barlow Condensed', sans-serif"
            font-size="9" font-weight="700"
            fill="white" letter-spacing="0">
        ${label}
      </text>
    </svg>`
  return {
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  }
}

function popupHtml(topo, type, viewTopoLabel, parkingLabel, routesLabel) {
  const typeLabel = type === 'parking'
    ? (parkingLabel || '🅿 Parking')
    : (routesLabel || '🧗 Routes')
  return `
    <div style="font-family:'Barlow Condensed',sans-serif;background:#2e2e2a;color:#f0ede6;padding:0;min-width:180px;">
      <div style="background:#c8502a;padding:0.4rem 0.75rem;font-size:0.62rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#f0ede6;">${typeLabel}</div>
      <div style="padding:0.6rem 0.75rem;">
        <div style="font-size:1rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:0.3rem;line-height:1.1;">${topo.title}</div>
        <a href="/topos/${topo.id}" style="display:inline-block;margin-top:0.4rem;font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#e06540;text-decoration:none;">${viewTopoLabel}</a>
      </div>
    </div>`
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function MapPage() {
  const { t } = useTranslation()
  const mapRef     = useRef(null)
  const leafletRef = useRef(null)
  // Live ref so the Leaflet event handler always sees the latest topo data
  const toposRef   = useRef([])

  const [loading, setLoading]         = useState(true)
  const [markerCount, setMarkerCount] = useState(0)

  // Context menu
  const [ctxMenu, setCtxMenu]     = useState(null)
  const [ctxHovered, setCtxHovered] = useState(null)

  // Toast
  const [toast, setToast]   = useState({ visible: false, msg: '' })
  const toastTimer           = useRef(null)

  const showToast = useCallback(msg => {
    clearTimeout(toastTimer.current)
    setToast({ visible: true, msg })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800)
  }, [])

  // Close context menu on outside click or Escape
  useEffect(() => {
    if (!ctxMenu) return
    const close = () => setCtxMenu(null)
    const onKey = e => { if (e.key === 'Escape') close() }
    window.addEventListener('mousedown', close)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [ctxMenu])

  // Called when the user picks a topo from the context menu
  const handleSetLocation = useCallback(async (topo, type, latlng) => {
    setCtxMenu(null)
    const endpoint = type === 'parking'
      ? `/topos/${topo.id}/set_location_parking`
      : `/topos/${topo.id}/set_location_routes`

    try {
      await api.post(endpoint, { lat: latlng.lat, lon: latlng.lng })

      // Keep toposRef in sync so subsequent right-clicks reflect the new state
      toposRef.current = toposRef.current.map(t => {
        if (t.id !== topo.id) return t
        return type === 'parking'
          ? { ...t, parking_lat: latlng.lat, parking_lon: latlng.lng }
          : { ...t, routes_lat: latlng.lat, routes_lon: latlng.lng }
      })

      // Drop the new marker on the live map immediately
      const L = window.L
      if (L && leafletRef.current) {
        const icon = L.icon(makeIcon(type === 'parking' ? '#4a8fa8' : '#c8502a', type === 'parking' ? 'P' : 'R'))
        L.marker([latlng.lat, latlng.lng], { icon })
          .bindPopup(popupHtml(topo, type, t('map.viewTopo'), t('map.popupParking'), t('map.popupRoutes')), { maxWidth: 260 })
          .addTo(leafletRef.current)
        setMarkerCount(n => n + 1)
      }

      showToast(type === 'parking'
        ? t('map.parkingSet', { title: topo.title })
        : t('map.routesSet', { title: topo.title }))
    } catch (err) {
      showToast(`✗ ${err.response?.data?.error || t('map.failedLocation')}`)
    }
  }, [showToast])

  // ── Map initialisation (runs once) ─────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const loadLeaflet = () => new Promise(resolve => {
      if (window.L) { resolve(); return }
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = resolve
      document.head.appendChild(script)
    })

    const init = async () => {
      await loadLeaflet()
      const L = window.L
      if (!mapRef.current || leafletRef.current) return

      const map = L.map(mapRef.current, { center: [46.5, 2.5], zoom: 6 })
      leafletRef.current = map

      // Tile layers
      const topoLayer = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        { attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Style: &copy; OpenTopoMap', maxZoom: 17, subdomains: 'abc' }
      )
      const osmLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }
      )
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
      )
      topoLayer.addTo(map)
      L.control.layers(
        { [t('map.layerTopo')]: topoLayer, [t('map.layerStreet')]: osmLayer, [t('map.layerSatellite')]: satelliteLayer },
        null,
        { position: 'topleft', collapsed: false }
      ).addTo(map)

      // Inject CSS once
      if (!document.getElementById('cragmaster-map-style')) {
        const style = document.createElement('style')
        style.id = 'cragmaster-map-style'
        style.textContent = `
          .leaflet-popup-content-wrapper{background:#2e2e2a!important;border:1px solid #3a3a34!important;border-radius:0!important;padding:0!important;box-shadow:0 4px 24px rgba(0,0,0,.6)!important;overflow:hidden}
          .leaflet-popup-content{margin:0!important;width:auto!important}
          .leaflet-popup-tip{background:#2e2e2a!important}
          .leaflet-popup-close-button{color:#6b6b60!important;font-size:18px!important;top:4px!important;right:6px!important}
          .leaflet-popup-close-button:hover{color:#f0ede6!important}
          .leaflet-control-zoom a{background:#2e2e2a!important;color:#f0ede6!important;border-color:#3a3a34!important}
          .leaflet-control-zoom a:hover{background:#c8502a!important}
          .leaflet-attribution-flag{display:none!important}
          .leaflet-control-attribution{background:rgba(26,26,24,.75)!important;color:#6b6b60!important;font-size:10px!important}
          .leaflet-control-attribution a{color:#6b6b60!important}
          .leaflet-control-layers{background:rgba(26,26,24,.93)!important;border:1px solid #3a3a34!important;border-radius:0!important;box-shadow:0 2px 16px rgba(0,0,0,.5)!important;backdrop-filter:blur(8px)}
          .leaflet-control-layers-expanded{padding:8px 12px!important;min-width:180px}
          .leaflet-control-layers label{font-family:'Barlow Condensed',sans-serif!important;font-size:.78rem!important;font-weight:600!important;letter-spacing:.1em!important;text-transform:uppercase!important;color:#f0ede6!important;display:flex!important;align-items:center!important;gap:6px!important;padding:3px 0!important;cursor:pointer!important}
          .leaflet-control-layers label:hover{color:#e06540!important}
          .leaflet-control-layers-selector{accent-color:#c8502a!important}
          .leaflet-container{cursor:crosshair}
        `
        document.head.appendChild(style)
      }

      // Fetch topos and render existing markers
      try {
        const res = await api.get('/topos')
        const topos = res.data || []
        toposRef.current = topos

        const parkingIcon = L.icon(makeIcon('#4a8fa8', 'P'))
        const routesIcon  = L.icon(makeIcon('#c8502a', 'R'))
        let count = 0
        const bounds = []

        topos.forEach(topo => {
          if (topo.parking_lat != null && topo.parking_lon != null) {
            const ll = [topo.parking_lat, topo.parking_lon]
            bounds.push(ll)
            L.marker(ll, { icon: parkingIcon }).bindPopup(popupHtml(topo, 'parking', t('map.viewTopo'), t('map.popupParking'), t('map.popupRoutes')), { maxWidth: 260 }).addTo(map)
            count++
          }
          if (topo.routes_lat != null && topo.routes_lon != null) {
            const ll = [topo.routes_lat, topo.routes_lon]
            bounds.push(ll)
            L.marker(ll, { icon: routesIcon }).bindPopup(popupHtml(topo, 'routes', t('map.viewTopo'), t('map.popupParking'), t('map.popupRoutes')), { maxWidth: 260 }).addTo(map)
            count++
          }
        })

        setMarkerCount(count)
        if (bounds.length === 1) map.setView(bounds[0], 12)
        else if (bounds.length > 1) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 })
      } catch (err) {
        console.error('Failed to load topos:', err)
      }

      // ── Right-click → open context menu ────────────────────────────────
      map.on('contextmenu', e => {
        e.originalEvent.preventDefault()

        const topos = toposRef.current
        const needParking = topos.filter(t => t.parking_lat == null || t.parking_lon == null)
        const needRoutes  = topos.filter(t => t.routes_lat  == null || t.routes_lon  == null)
		console.log(needParking, needRoutes)

        // Nothing to offer? Do nothing.
        if (needParking.length === 0 && needRoutes.length === 0) return

        // Estimate menu height to avoid clipping at viewport edges
        const menuW = 260
        const menuH = 60 + needParking.length * 38 + needRoutes.length * 38 + 80
        const vw = window.innerWidth
        const vh = window.innerHeight
		const x = e.originalEvent.clientX + 4
		const y = e.originalEvent.clientY + 4

        // We need to bubble the latlng + pixel position up to React state.
        // We do this via a custom event on the map container so it crosses
        // the Leaflet/React boundary cleanly.
        mapRef.current.dispatchEvent(new CustomEvent('cm:contextmenu', {
          detail: { x, y, latlng: e.latlng, needParking, needRoutes }
        }))
      })

      setLoading(false)
    }

    init()

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for the custom event from Leaflet and update React state
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const handler = e => {
      const { x, y, latlng, needParking, needRoutes } = e.detail
      setCtxMenu({ x, y, latlng, toposNeedingParking: needParking, toposNeedingRoutes: needRoutes })
    }
    el.addEventListener('cm:contextmenu', handler)
    return () => el.removeEventListener('cm:contextmenu', handler)
  }, [loading]) // re-attach once the map div is in DOM (loading → false)

  const fmtCoord = n => n.toFixed(5)

  return (
    <div style={S.root}>
      <div style={S.noise} />

      {/* ── HEADER ── */}
      <div style={S.header}>
        <div style={S.titleBlock}>
          <span style={S.eyebrow}>{t('map.eyebrow')}</span>
          <h1 style={S.title}>{t('map.title')}</h1>
        </div>

        <div style={S.legend}>
          <div style={S.legendItem}>
            <div style={S.legendDot('#4a8fa8')} />
            {t('map.parking')}
          </div>
          <div style={S.legendItem}>
            <div style={S.legendDot('#c8502a')} />
            {t('map.routes')}
          </div>
          <div style={{ ...S.legendItem, opacity: 0.45, fontSize: '0.65rem' }}>
            {t('map.hint')}
          </div>
        </div>
      </div>

      {/* ── MAP ── */}
      <div style={S.mapWrapper}>
        {loading && (
          <div style={S.loadingOverlay}>
            <span style={S.loadingText}>{t('map.loading')}</span>
          </div>
        )}

        {!loading && (
          <div style={S.countBadge}>
            {markerCount} {t('map.location', { count: markerCount })} {t('map.plotted')}
          </div>
        )}

        {!loading && markerCount === 0 && (
          <div style={S.emptyState}>
            <span style={S.emptyTitle}>{t('map.noLocations')}</span>
            <span style={S.emptyHint}>{t('map.noLocationsHint')}</span>
          </div>
        )}

        <div ref={mapRef} style={S.mapEl} />
      </div>

      {/* ── CONTEXT MENU ── */}
 {ctxMenu && (
  <div
    style={{
      ...S.ctxMenu(ctxMenu.x, ctxMenu.y),
      display: 'flex',
      flexDirection: 'column',
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '70vh',
    }}
    onMouseDown={e => e.stopPropagation()}
  >
    {/* Header */}
    <div style={S.ctxHeader}>
      <span>{t('map.setLocation')}</span>

      <span style={S.ctxCoords}>
        {fmtCoord(ctxMenu.latlng.lat)},
        {' '}
        {fmtCoord(ctxMenu.latlng.lng)}
      </span>
    </div>

    {/* Two-column layout */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'var(--grid-2col, 1fr 1fr)',
        gap: '0',
        flex: 1,
        minHeight: 0,
      }}
    >

      {/* ── Parking column ───────────────────── */}
      <div
        style={{
          borderRight: '1px solid #2a2a28',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <div style={S.ctxSectionLabel}>
          {t('map.setParking')}
        </div>

        <div
          style={{
            overflowY: 'auto',
            flex: 1,
            paddingBottom: '0.5rem',
          }}
        >
          {ctxMenu.toposNeedingParking.length === 0 ? (
            <div style={S.ctxEmpty}>
              {t('map.allParkingSet')}
            </div>
          ) : (
            ctxMenu.toposNeedingParking.map(topo => {
              const key = `parking-${topo.id}`

              return (
                <div
                  key={key}
                  style={S.ctxItem(ctxHovered === key)}
                  onMouseEnter={() => setCtxHovered(key)}
                  onMouseLeave={() => setCtxHovered(null)}
                  onMouseDown={e => {
                    e.stopPropagation()

                    handleSetLocation(
                      topo,
                      'parking',
                      ctxMenu.latlng
                    )
                  }}
                >
                  <span
                    style={{
                      opacity: 0.5,
                      fontSize: '0.7rem'
                    }}
                  >
                    →
                  </span>

                  {topo.title}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Routes column ───────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <div style={S.ctxSectionLabel}>
          {t('map.setRoutes')}
        </div>

        <div
          style={{
            overflowY: 'auto',
            flex: 1,
            paddingBottom: '0.5rem',
          }}
        >
          {ctxMenu.toposNeedingRoutes.length === 0 ? (
            <div style={S.ctxEmpty}>
              {t('map.allRoutesSet')}
            </div>
          ) : (
            ctxMenu.toposNeedingRoutes.map(topo => {
              const key = `routes-${topo.id}`

              return (
                <div
                  key={key}
                  style={S.ctxItem(ctxHovered === key)}
                  onMouseEnter={() => setCtxHovered(key)}
                  onMouseLeave={() => setCtxHovered(null)}
                  onMouseDown={e => {
                    e.stopPropagation()

                    handleSetLocation(
                      topo,
                      'routes',
                      ctxMenu.latlng
                    )
                  }}
                >
                  <span
                    style={{
                      opacity: 0.5,
                      fontSize: '0.7rem'
                    }}
                  >
                    →
                  </span>

                  {topo.title}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div
      style={S.ctxDismiss}
      onMouseDown={e => {
        e.stopPropagation()
        setCtxMenu(null)
      }}
    >
      {t('map.dismiss')}
    </div>
  </div>
)}
{/* ── TOAST notification ── */}
      <div style={S.toast(toast.visible)}>{toast.msg}</div>
    </div>
  )
}

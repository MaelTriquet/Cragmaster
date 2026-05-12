import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

// ── Leaflet is loaded via CDN in index.html ───────────────────────────────────
// Add these two lines to your public/index.html <head>:
//   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
//   <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

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
    padding: '2rem 2rem 1rem',
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
    fontSize: '3rem',
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
    margin: '0 2rem 2rem',
    border: '1px solid var(--line)',
    minHeight: '500px',
  },

  mapEl: {
    width: '100%',
    height: '100%',
    minHeight: '500px',
  },

  // count badge top-right of map
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
}

// ── Custom SVG marker factory ─────────────────────────────────────────────────
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
    </svg>
  `
  return {
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  }
}

// ── Popup HTML ────────────────────────────────────────────────────────────────
function popupHtml(topo, type) {
  const typeLabel = type === 'parking' ? '🅿 Parking' : '🧗 Routes'
  return `
    <div style="
      font-family: 'Barlow Condensed', sans-serif;
      background: #2e2e2a;
      color: #f0ede6;
      padding: 0;
      min-width: 180px;
    ">
      <div style="
        background: #c8502a;
        padding: 0.4rem 0.75rem;
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #f0ede6;
      ">${typeLabel}</div>
      <div style="padding: 0.6rem 0.75rem;">
        <div style="
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 0.3rem;
          line-height: 1.1;
        ">${topo.title}</div>
        <a
          href="/topos/${topo.id}"
          style="
            display: inline-block;
            margin-top: 0.4rem;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #e06540;
            text-decoration: none;
          "
        >View Topo →</a>
      </div>
    </div>
  `
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MapPage() {
  const mapRef    = useRef(null)   // DOM node
  const leafletRef = useRef(null)  // L.Map instance
  const navigate  = useNavigate()

  const [loading, setLoading]   = useState(true)
  const [markerCount, setMarkerCount] = useState(0)

  useEffect(() => {
    // Inject Leaflet CSS + JS if not already present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const loadLeaflet = () => {
      return new Promise(resolve => {
        if (window.L) { resolve(); return }
        const script = document.createElement('script')
        script.id = 'leaflet-js'
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = resolve
        document.head.appendChild(script)
      })
    }

    const init = async () => {
      await loadLeaflet()

      const L = window.L
      if (!mapRef.current || leafletRef.current) return

      // ── Init map centred on France ──
      const map = L.map(mapRef.current, {
        center: [46.5, 2.5],
        zoom: 6,
        zoomControl: true,
      })

      leafletRef.current = map

      // ── Tile layers ──────────────────────────────────────────────────────────
      // OpenTopoMap: relief shading + contours + cliffs + trails + roads
      const topoLayer = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          maxZoom: 17,
          subdomains: 'abc',
        }
      )

      // OSM standard: detailed streets, paths, place names — good when zoomed in
      const osmLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      )

      // IGN aerial (no API key needed for public WMS endpoint)
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics',
          maxZoom: 19,
        }
      )

      // Default: topo
      topoLayer.addTo(map)

      // ── Layer control (top-left, below zoom) ──
      const baseLayers = {
        '🗺 Topo (relief + trails)': topoLayer,
        '🛣 Street (OSM)': osmLayer,
        '🛰 Satellite': satelliteLayer,
      }
      L.control.layers(baseLayers, null, { position: 'topleft', collapsed: false }).addTo(map)

      // ── Custom popup styles ──
      const style = document.createElement('style')
      style.textContent = `
        .leaflet-popup-content-wrapper {
          background: #2e2e2a !important;
          border: 1px solid #3a3a34 !important;
          border-radius: 0 !important;
          padding: 0 !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.6) !important;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: #2e2e2a !important;
        }
        .leaflet-popup-close-button {
          color: #6b6b60 !important;
          font-size: 18px !important;
          top: 4px !important;
          right: 6px !important;
        }
        .leaflet-popup-close-button:hover {
          color: #f0ede6 !important;
        }
        .leaflet-control-zoom a {
          background: #2e2e2a !important;
          color: #f0ede6 !important;
          border-color: #3a3a34 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #c8502a !important;
        }
        .leaflet-attribution-flag { display: none !important; }
        .leaflet-control-attribution {
          background: rgba(26,26,24,0.75) !important;
          color: #6b6b60 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #6b6b60 !important; }

        /* ── Layer switcher ── */
        .leaflet-control-layers {
          background: rgba(26,26,24,0.93) !important;
          border: 1px solid #3a3a34 !important;
          border-radius: 0 !important;
          box-shadow: 0 2px 16px rgba(0,0,0,0.5) !important;
          backdrop-filter: blur(8px);
        }
        .leaflet-control-layers-expanded {
          padding: 8px 12px !important;
          min-width: 180px;
        }
        .leaflet-control-layers label {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-size: 0.78rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          color: #f0ede6 !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 3px 0 !important;
          cursor: pointer !important;
        }
        .leaflet-control-layers label:hover { color: #e06540 !important; }
        .leaflet-control-layers-selector { accent-color: #c8502a !important; }
        .leaflet-control-layers-toggle {
          background-color: #2e2e2a !important;
          border: 1px solid #3a3a34 !important;
        }
      `
      document.head.appendChild(style)

      // ── Fetch topos and plot ──
      try {
        const res = await api.get('/topos')
        const topos = res.data || []

        const parkingIcon = L.icon(makeIcon('#4a8fa8', 'P'))
        const routesIcon  = L.icon(makeIcon('#c8502a', 'R'))

        let count = 0
        const bounds = []

        topos.forEach(topo => {
          // Parking marker
          if (topo.parking_lat != null && topo.parking_lon != null) {
            const latlng = [topo.parking_lat, topo.parking_lon]
            bounds.push(latlng)
            L.marker(latlng, { icon: parkingIcon })
              .bindPopup(popupHtml(topo, 'parking'), { maxWidth: 260 })
              .addTo(map)
            count++
          }
          // Routes marker
          if (topo.routes_lat != null && topo.routes_lon != null) {
            const latlng = [topo.routes_lat, topo.routes_lon]
            bounds.push(latlng)
            L.marker(latlng, { icon: routesIcon })
              .bindPopup(popupHtml(topo, 'routes'), { maxWidth: 260 })
              .addTo(map)
            count++
          }
        })

        setMarkerCount(count)

        // Fit map to markers if any exist
        if (bounds.length > 0) {
          if (bounds.length === 1) {
            map.setView(bounds[0], 12)
          } else {
            map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 })
          }
        }
      } catch (err) {
        console.error('Failed to load topos:', err)
      }

      setLoading(false)
    }

    init()

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [])

  return (
    <div style={S.root}>
      <div style={S.noise} />

      {/* ── HEADER ── */}
      <div style={S.header}>
        <div style={S.titleBlock}>
          <span style={S.eyebrow}>Topo Locations</span>
          <h1 style={S.title}>Map</h1>
        </div>

        <div style={S.legend}>
          <div style={S.legendItem}>
            <div style={S.legendDot('#4a8fa8')} />
            Parking
          </div>
          <div style={S.legendItem}>
            <div style={S.legendDot('#c8502a')} />
            Routes
          </div>
          <div style={{ ...S.legendItem, opacity: 0.5, fontSize: '0.65rem' }}>
            Use the layer switcher on the map to toggle Topo / Street / Satellite
          </div>
        </div>
      </div>

      {/* ── MAP ── */}
      <div style={S.mapWrapper}>
        {/* Loading overlay */}
        {loading && (
          <div style={S.loadingOverlay}>
            <span style={S.loadingText}>Loading map…</span>
          </div>
        )}

        {/* Marker count badge */}
        {!loading && (
          <div style={S.countBadge}>
            {markerCount} location{markerCount !== 1 ? 's' : ''} plotted
          </div>
        )}

        {/* Empty state (shown after load if 0 markers) */}
        {!loading && markerCount === 0 && (
          <div style={S.emptyState}>
            <span style={S.emptyTitle}>No locations set yet</span>
            <span style={S.emptyHint}>
              Open a topo and set its parking or routes location to see it here
            </span>
          </div>
        )}

        <div ref={mapRef} style={S.mapEl} />
      </div>
    </div>
  )
}

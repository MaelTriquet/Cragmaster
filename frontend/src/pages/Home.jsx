// Cragmaster - climbing topo manager
// Copyright (C) 2026  mtriquet
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import api from '../api/client'
import { getOfflineTopoIds, getOfflineTopo, isOnline } from '../lib/offline'

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
    maxWidth: "780px",
    position: "relative",
    zIndex: 1,
  },
  hero: {
    textAlign: "center",
    marginTop: "2rem",
    marginBottom: "1.5rem",
  },
  logo: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "clamp(2.8rem, 8vw, 5rem)",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: 0,
    lineHeight: 0.9,
  },
  logoAccent: {
    color: "var(--hold)",
  },
  tagline: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "clamp(0.8rem, 2vw, 1rem)",
    fontWeight: 400,
    letterSpacing: "0.15em",
    color: "var(--muted)",
    textTransform: "uppercase",
    marginTop: "0.5rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.75rem",
    margin: "1.5rem 0",
  },
  statsGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.75rem",
    margin: "1.5rem 0",
  },
  statCard: {
    background: "var(--granite)",
    borderLeft: "3px solid var(--hold)",
    padding: "1rem",
    textAlign: "center",
  },
  statValue: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
    fontWeight: 800,
    color: "var(--chalk)",
    lineHeight: 1,
    letterSpacing: "-0.01em",
  },
  statRatio: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 500,
    color: "var(--muted)",
    marginTop: "0.2rem",
  },
  statLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    color: "var(--muted)",
    textTransform: "uppercase",
    marginTop: "0.35rem",
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    margin: "2rem 0",
  },
  actionBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "1.5rem 1rem",
    border: "none",
    borderBottom: "3px solid var(--hold)",
    color: "var(--chalk)",
    background: "var(--granite)",
    cursor: "pointer",
    textAlign: "center",
    transition: "background 0.15s, border-color 0.15s",
  },
  loadingText: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    color: "var(--muted)",
    letterSpacing: "0.1em",
  },
  emptyText: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.8rem",
    color: "var(--muted)",
    letterSpacing: "0.08em",
  },
}

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/home')
        setHomeData(res.data)
      } catch {
        if (!isOnline()) {
          const ids = await getOfflineTopoIds()
          const topos = []
          for (const id of ids) {
            const t = await getOfflineTopo(id)
            if (t) topos.push(t)
          }
          setHomeData({
            topo_count: topos.length,
            route_count: 0,
            user_count: 0,
            topo_pct: 0,
            route_pct: 0,
          })
        }
      }
      setLoading(false)
    })()
  }, [])

  const topoCount = homeData?.topo_count ?? 0
  const routeCount = homeData?.route_count ?? 0
  const userCount = homeData?.user_count ?? 0
  const topoScore = homeData?.topo_score ?? 0
  const routeScore = homeData?.route_score ?? 0
  const topoPct = homeData?.topo_pct ?? 0
  const routePct = homeData?.route_pct ?? 0

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.container}>
        <div style={S.hero}>
          <h1 style={S.logo}>
            <span style={S.logoAccent}>Crag</span>Master
          </h1>
          <div style={S.tagline}>{t('home.tagline')}</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <span style={S.loadingText}>{t('home.loading')}</span>
          </div>
        ) : (
          <>
            <div style={S.statsGrid}>
              <div style={S.statCard}>
                <div style={S.statValue}>{topoCount}</div>
                <div style={S.statLabel}>{t('home.statsTopos')}</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statValue}>{routeCount}</div>
                <div style={S.statLabel}>{t('home.statsRoutes')}</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statValue}>{userCount}</div>
                <div style={S.statLabel}>{t('home.statsUsers')}</div>
              </div>
            </div>
            <div style={S.statsGrid2}>
              <div style={S.statCard}>
                <div style={S.statValue}>{topoPct.toFixed(2)}%</div>
                <div style={S.statLabel}>{t('home.statsTopoCompletion')}</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statValue}>{routePct.toFixed(2)}%</div>
                <div style={S.statLabel}>{t('home.statsRouteCompletion')}</div>
              </div>
            </div>

            <div style={S.actions}>
              <button
                style={S.actionBtn}
                onClick={() => navigate('/routes')}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--rock)'; e.currentTarget.style.borderBottomColor = 'var(--chalk)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--granite)'; e.currentTarget.style.borderBottomColor = 'var(--hold)' }}
              >
                {t('nav.routes')}
              </button>
              <button
                style={S.actionBtn}
                onClick={() => navigate('/topos')}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--rock)'; e.currentTarget.style.borderBottomColor = 'var(--chalk)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--granite)'; e.currentTarget.style.borderBottomColor = 'var(--hold)' }}
              >
                {t('nav.topos')}
              </button>
              <button
                style={S.actionBtn}
                onClick={() => navigate('/map')}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--rock)'; e.currentTarget.style.borderBottomColor = 'var(--chalk)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--granite)'; e.currentTarget.style.borderBottomColor = 'var(--hold)' }}
              >
                {t('nav.map')}
              </button>
              <button
                style={S.actionBtn}
                onClick={() => navigate('/stats')}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--rock)'; e.currentTarget.style.borderBottomColor = 'var(--chalk)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--granite)'; e.currentTarget.style.borderBottomColor = 'var(--hold)' }}
              >
                {t('nav.stats')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

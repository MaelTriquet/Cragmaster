import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import api from '../api/client'

// ── Grade colour (same palette as the rest of the app) ──────────────────────
const getGradeColor = (sorting_grade) => {
  if (sorting_grade < 0) return 'hsl(0, 0%, 50%)'
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
  if (sorting_grade <= stops[0][0]) return `hsl(${stops[0][1]},${stops[0][2]}%,${stops[0][3]}%)`
  if (sorting_grade >= stops[stops.length-1][0]) {
    const s = stops[stops.length-1]
    return `hsl(${s[1]},${s[2]}%,${s[3]}%)`
  }
  let lo, hi
  for (let i = 0; i < stops.length-1; i++) {
    if (sorting_grade >= stops[i][0] && sorting_grade <= stops[i+1][0]) {
      lo = stops[i]; hi = stops[i+1]; break
    }
  }
  const t = (sorting_grade - lo[0]) / (hi[0] - lo[0])
  let dh = hi[1] - lo[1]
  if (dh > 180) dh -= 360
  if (dh < -180) dh += 360
  return `hsl(${(lo[1]+dh*t).toFixed(1)},${(lo[2]+(hi[2]-lo[2])*t).toFixed(1)}%,${(lo[3]+(hi[3]-lo[3])*t).toFixed(1)}%)`
}

const CATEGORY_ORDER = ['route_style', 'hold', 'approche', 'exposure', 'style', 'other']

const CATEGORY_COLORS = {
  route_style: 'hsl(200, 60%, 50%)',
  hold:        'hsl(140, 50%, 45%)',
  approche:    'hsl(30,  70%, 50%)',
  exposure:    'hsl(260, 50%, 55%)',
  style:       'hsl(350, 60%, 50%)',
  other:       'hsl(0,   0%,  50%)',
}

const GRADE_OPTIONS = []
for (let n = 3; n <= 9; n++) {
  for (const l of ['a', 'b', 'c']) {
    GRADE_OPTIONS.push({ label: `${n}${l}`, sort: GRADE_OPTIONS.length })
    GRADE_OPTIONS.push({ label: `${n}${l}+`, sort: GRADE_OPTIONS.length })
  }
}

// ── Tiny bar-chart component ─────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, sortingKey, title, unit = '' }) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(null)
  if (!data || data.length === 0) return (
    <div style={S.emptyChart}>{t('stats.noData')}</div>
  )
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div>
      <div style={S.chartTitle}>{title}</div>
      <div style={S.barChart}>
        {data.map((d, i) => {
          const pct = (d[valueKey] / max) * 100
          const color = getGradeColor(d[sortingKey])
          const isHov = hovered === i
          return (
            <div
              key={i}
              style={S.barGroup}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHov && (
                <div style={S.tooltip}>
                  {d[valueKey]}{unit}
                </div>
              )}
              {/* Bar */}
              <div style={S.barWrapper}>
                <div
                  style={{
                    ...S.bar,
                    height: `${Math.max(pct, 4)}%`,
                    background: color,
                    opacity: isHov ? 1 : 0.8,
                    transform: isHov ? 'scaleX(1.08)' : 'scaleX(1)',
                  }}
                />
              </div>
              {/* Grade label */}
              <span style={{ ...S.barLabel, color: isHov ? 'var(--chalk)' : 'var(--muted)' }}>
                {d[labelKey]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Horizontal bar chart (for avg attempts) ──────────────────────────────────
function HBarChart({ data, valueKey, labelKey, sortingKey, title, unit = '' }) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(null)
  if (!data || data.length === 0) return (
    <div style={S.emptyChart}>{t('stats.noData')}</div>
  )
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div>
      <div style={S.chartTitle}>{title}</div>
      <div style={S.hBarChart}>
        {data.map((d, i) => {
          const pct = (d[valueKey] / max) * 100
          const color = getGradeColor(d[sortingKey])
          const isHov = hovered === i
          return (
            <div
              key={i}
              style={S.hBarRow}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ ...S.hBarLabel, color: isHov ? 'var(--chalk)' : 'var(--muted)' }}>
                {d[labelKey]}
              </span>
              <div style={S.hBarTrack}>
                <div style={{
                  ...S.hBar,
                  width: `${Math.max(pct, 2)}%`,
                  background: color,
                  opacity: isHov ? 1 : 0.8,
                }} />
              </div>
              <span style={{
                ...S.hBarValue,
                color: isHov ? 'var(--chalk)' : 'var(--muted)',
              }}>
                {d[valueKey]}{unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Tag fingerprint component ─────────────────────────────────────────────────
function TagFingerprint({ data, title }) {
  const { t, i18n } = useTranslation()
  const [hovered, setHovered] = useState(null)
  const tagName = (tag) => (i18n.language === 'fr' && tag.name_fr ? tag.name_fr : tag.name)

  if (!data || data.length === 0) return (
    <div style={S.emptyChart}>{t('stats.noData')}</div>
  )

  const byCategory = {}
  for (const d of data) {
    const cat = d.category || 'other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(d)
  }
  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div>
      <div style={S.chartTitle}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {CATEGORY_ORDER.map(cat => {
          const items = byCategory[cat]
          if (!items || items.length === 0) return null
          return (
            <div key={cat}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: CATEGORY_COLORS[cat] || 'var(--muted)',
                marginBottom: '0.35rem',
              }}>
                {t(`tags.category_${cat}`)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {items.map((d, i) => {
                  const pct = (d.count / maxCount) * 100
                  const isHov = hovered === `${cat}-${i}`
                  const color = CATEGORY_COLORS[cat] || 'var(--muted)'
                  return (
                    <div
                      key={d.name}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'default',
                      }}
                      onMouseEnter={() => setHovered(`${cat}-${i}`)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: '0.68rem', fontWeight: 600,
                        letterSpacing: '0.05em',
                        color: isHov ? 'var(--chalk)' : 'var(--muted)',
                        width: '70px', flexShrink: 0, textAlign: 'right',
                        transition: 'color 0.15s',
                      }}>
                        {tagName(d)}
                      </span>
                      <div style={{
                        flex: 1, height: '14px',
                        background: 'rgba(255,255,255,0.04)',
                        position: 'relative',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.max(pct, 2)}%`,
                          background: color,
                          opacity: isHov ? 1 : 0.7,
                          transition: 'width 0.4s ease, opacity 0.15s',
                        }} />
                      </div>
                      <span style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: '0.65rem', fontWeight: 700,
                        color: isHov ? 'var(--chalk)' : 'var(--muted)',
                        width: '24px', textAlign: 'right',
                        transition: 'color 0.15s',
                      }}>
                        {d.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Flash rate pie chart ─────────────────────────────────────────────────────
function FlashPie({ data, title }) {
  const { t } = useTranslation()
  const [selectedGrade, setSelectedGrade] = useState('')
  const [hoveredSlice, setHoveredSlice] = useState(null)

  if (!data || data.length === 0) return (
    <div style={S.emptyChart}>{t('stats.noData')}</div>
  )

  const gradeData = selectedGrade
    ? data.find(d => d.grade === selectedGrade)
    : null

  const pieData = gradeData
    ? [
        { label: t('stats.flash'), value: gradeData.flash_count, color: 'hsl(140, 50%, 45%)' },
        { label: t('stats.nonFlash'), value: gradeData.non_flash_count, color: 'var(--hold)' },
      ]
    : []

  const total = pieData.reduce((s, d) => s + d.value, 0)
  const flashRate = total > 0 ? Math.round((pieData[0]?.value || 0) / total * 100) : 0

  // SVG pie helpers
  const cx = 100, cy = 100, r = 80
  let currentAngle = -Math.PI / 2
  const slices = pieData.map(d => {
    const sliceAngle = total > 0 ? (d.value / total) * Math.PI * 2 : 0
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle
    currentAngle = endAngle
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = sliceAngle > Math.PI ? 1 : 0
    const path = sliceAngle >= Math.PI * 2
      ? `M${cx},${cy - r} A${r},${r} 0 1,1 ${cx - 0.01},${cy - r} A${r},${r} 0 1,1 ${cx},${cy - r}`
      : sliceAngle > 0
        ? `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`
        : null
    return { ...d, path, startAngle, endAngle }
  }).filter(s => s.path)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={S.chartTitle}>{title}</div>
        <div style={{ marginLeft: 'auto' }}>
          <select
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.65rem', fontWeight: 600,
              letterSpacing: '0.05em',
              background: 'var(--rock)', border: '1px solid var(--line)',
              color: selectedGrade ? 'var(--chalk)' : 'var(--muted)',
              padding: '0.25rem 0.4rem', borderRadius: '3px',
              cursor: 'pointer', outline: 'none',
            }}
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
          >
            <option value="">{t('stats.selectGrade')}</option>
            {data.map(d => (
              <option key={d.grade} value={d.grade}>{d.grade}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedGrade ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem 0',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '0.85rem', letterSpacing: '0.05em',
          color: 'var(--muted)',
        }}>
          {t('stats.pickGrade')}
        </div>
      ) : !gradeData ? (
        <div style={S.emptyChart}>{t('stats.noData')}</div>
      ) : total === 0 ? (
        <div style={S.emptyChart}>{t('stats.noData')}</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center' }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {slices.map((s, i) => {
              const isHov = hoveredSlice === i
              const midAngle = (s.startAngle + s.endAngle) / 2
              const explodeOffset = isHov ? 6 : 0
              const dx = explodeOffset * Math.cos(midAngle)
              const dy = explodeOffset * Math.sin(midAngle)
              const transform = dx || dy ? `translate(${dx},${dy})` : undefined
              return (
                <path
                  key={i}
                  d={s.path}
                  fill={s.color}
                  opacity={isHov ? 1 : 0.85}
                  transform={transform}
                  style={{ transition: 'opacity 0.15s, transform 0.2s', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredSlice(i)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )
            })}
            {total > 0 && (
              <text x={cx} y={cy - 6} textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontSize="28" fontWeight="800" fill="var(--chalk)">
                {total}
              </text>
            )}
            {total > 0 && (
              <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontSize="12" fontWeight="600" fill="var(--muted)">
                {flashRate}% flash
              </text>
            )}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pieData.map((d, i) => {
              const isHov = hoveredSlice === i
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '0.75rem', fontWeight: 600,
                    letterSpacing: '0.05em',
                    color: isHov ? 'var(--chalk)' : 'var(--muted)',
                    cursor: 'pointer', transition: 'color 0.15s',
                  }}
                  onMouseEnter={() => setHoveredSlice(i)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span style={{
                    width: '10px', height: '10px',
                    background: d.color, display: 'inline-block',
                    flexShrink: 0,
                  }} />
                  {d.label}
                  <span style={{ fontWeight: 700, color: 'var(--chalk)' }}>{d.value}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    padding: 'var(--page-padding)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  container: {
    width: '100%',
    maxWidth: '860px',
    position: 'relative',
    zIndex: 1,
  },

  // ── Header
  header: {
    borderLeft: '4px solid var(--hold)',
    paddingLeft: '1.5rem',
    marginBottom: '2.5rem',
  },
  eyebrow: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'var(--hold)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.4rem',
  },
  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--title-3xl)',
    fontWeight: 800,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: 0,
    lineHeight: 0.95,
  },

  // ── Summary row
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'var(--grid-3col, repeat(3, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'var(--granite)',
    borderLeft: '4px solid var(--hold)',
    padding: '1.25rem 1.5rem',
  },
  statValue: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '3.5rem',
    fontWeight: 800,
    color: 'var(--chalk)',
    lineHeight: 1,
    letterSpacing: '-0.01em',
  },
  statLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginTop: '0.3rem',
  },

  // ── Max grade hero card
  heroCard: {
    background: 'var(--granite)',
    padding: '1.75rem 2rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  heroLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '0.4rem',
  },
  heroGrade: (color) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '5rem',
    fontWeight: 800,
    letterSpacing: '0.02em',
    color,
    lineHeight: 1,
    textShadow: `0 0 60px ${color}55`,
  }),
  heroSub: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    color: 'var(--muted)',
    marginTop: '0.25rem',
  },
  heroNone: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
  },

  // ── Chart grid
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'var(--grid-2col, 1fr 1fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  chartCard: {
    background: 'var(--granite)',
    borderLeft: '2px solid var(--line)',
    padding: '1.5rem',
  },
  chartCardFull: {
    background: 'var(--granite)',
    borderLeft: '2px solid var(--line)',
    padding: '1.5rem',
    gridColumn: '1 / -1',
  },
  chartTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--hold)',
    marginBottom: '1.25rem',
  },
  emptyChart: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.82rem',
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    padding: '1.5rem 0',
    textTransform: 'uppercase',
  },

  // ── Vertical bar chart
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '6px',
    height: '160px',
  },
  barGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    gap: '4px',
    position: 'relative',
    cursor: 'default',
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
  },
  bar: {
    width: '100%',
    transition: 'height 0.4s ease, transform 0.15s, opacity 0.15s',
    transformOrigin: 'bottom',
  },
  barLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'color 0.15s',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tooltip: {
    position: 'absolute',
    top: '-28px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--chalk)',
    padding: '2px 6px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 10,
  },

  // ── Horizontal bar chart
  hBarChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  hBarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'default',
  },
  hBarLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    width: '36px',
    flexShrink: 0,
    transition: 'color 0.15s',
  },
  hBarTrack: {
    flex: 1,
    height: '8px',
    background: 'rgba(255,255,255,0.04)',
    position: 'relative',
  },
  hBar: {
    height: '100%',
    transition: 'width 0.5s ease, opacity 0.15s',
  },
  hBarValue: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    width: '40px',
    textAlign: 'right',
    flexShrink: 0,
    transition: 'color 0.15s',
  },

  // ── Working routes
  workingList: {
    display: 'flex',
    flexDirection: 'column',
  },
  workingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0',
    borderBottom: '1px solid var(--line)',
    cursor: 'pointer',
  },
  workingGrade: (color) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '0.15rem 0.45rem',
    flexShrink: 0,
    color: 'var(--chalk)',
    background: color,
  }),
  workingName: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.9rem',
    color: 'var(--chalk)',
    flex: 1,
    transition: 'color 0.15s',
  },
  workingTopo: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },
  workingAttempts: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    flexShrink: 0,
  },
  workingArrow: {
    fontSize: '0.85rem',
    color: 'var(--line)',
    flexShrink: 0,
    transition: 'color 0.15s',
  },

  loadingText: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1.2rem',
    letterSpacing: '0.1em',
    color: 'var(--muted)',
  },
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Stats() {
  const { userId } = useParams()
  const { t } = useTranslation()
  const [stats, setStats]   = useState(null)
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const url = userId ? `/stats?user_id=${userId}` : '/stats'
    api.get(url).then(res => setStats(res.data)).catch(console.error)
  }, [userId])

  if (!stats) return (
    <div style={{ ...S.root, justifyContent: 'center', alignItems: 'center' }}>
      <span style={S.loadingText}>{t('stats.loading')}</span>
    </div>
  )

  const { max_grade, grade_pyramid, avg_attempts_per_grade, working, tag_breakdown, flash_by_grade, summary, username } = stats

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{username ? `${username} — ${t('stats.title')}` : t('stats.eyebrow')}</span>
          <h1 style={S.title}>{t('stats.title')}</h1>
        </div>

        {/* ── SUMMARY NUMBERS ── */}
        <div style={S.summaryRow}>
          {[
            { value: summary.total_sent,     label: t('stats.routesSent')    },
            { value: summary.total_attempts, label: t('stats.totalAttempts') },
            { value: summary.total_working,  label: t('stats.inProgress')    },
          ].map((s, i) => (
            <div key={i} style={S.statCard}>
              <div style={S.statValue}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MAX GRADE HERO ── */}
        <div style={S.heroCard}>
          <div>
            <div style={S.heroLabel}>{t('stats.hardestGradeSent')}</div>
            {max_grade ? (
              <>
                <div style={S.heroGrade(getGradeColor(max_grade.sorting_grade))}>
                  {max_grade.grade}
                </div>
                <div style={S.heroSub}>{t('stats.personalBest')}</div>
              </>
            ) : (
              <div style={S.heroNone}>{t('stats.noSends')}</div>
            )}
          </div>

          {/* Decorative grade scale strip */}
          {grade_pyramid.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {grade_pyramid.map((g, i) => (
                <div
                  key={i}
                  title={g.grade}
                  style={{
                    width: '10px',
                    height: `${Math.min(8 + g.count * 8, 64)}px`,
                    background: getGradeColor(g.sorting_grade),
                    opacity: max_grade && g.grade === max_grade.grade ? 1 : 0.5,
                    transition: 'height 0.3s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── CHARTS ── */}
        <div style={S.chartGrid}>

          {/* Grade pyramid */}
          <div style={S.chartCard}>
            <BarChart
              data={grade_pyramid}
              valueKey="count"
              labelKey="grade"
              sortingKey="sorting_grade"
              title={t('stats.sendsPerGrade')}
              unit=""
            />
          </div>

          {/* Avg attempts per grade */}
          <div style={S.chartCard}>
            <HBarChart
              data={avg_attempts_per_grade}
              valueKey="avg"
              labelKey="grade"
              sortingKey="sorting_grade"
              title={t('stats.avgAttemptsToSend')}
              unit={t('stats.tries')}
            />
          </div>

          {/* Working routes */}
          <div style={S.chartCardFull}>
            <div style={S.chartTitle}>
              {t('stats.inProgressSection')} — {working.length} {t('stats.route', { count: working.length })}
            </div>
            {working.length === 0 ? (
              <div style={S.emptyChart}>{t('stats.nothingInProgress')}</div>
            ) : (
              <div style={S.workingList}>
                {working.map((r, i) => {
                  const isHov = hovered === `w${i}`
                  const color = getGradeColor(r.sorting_grade)
                  return (
                    <div
                      key={i}
                      style={{
                        ...S.workingRow,
                        background: isHov ? 'rgba(255,255,255,0.02)' : 'transparent',
                      }}
                      onMouseEnter={() => setHovered(`w${i}`)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => navigate(`/routes/${r.route_id}`)}
                    >
                      <span style={S.workingGrade(color)}>{r.grade}</span>
                      <span style={{
                        ...S.workingName,
                        color: isHov ? 'var(--hold-lt)' : 'var(--chalk)',
                      }}>
                        {r.route_name}
                      </span>
                      <span style={S.workingTopo}>{r.topo_title}</span>
                      <span style={S.workingAttempts}>
                        {r.attempts} {t('stats.attempt', { count: r.attempts })}
                      </span>
                      <span style={{
                        ...S.workingArrow,
                        color: isHov ? 'var(--hold)' : 'var(--line)',
                      }}>›</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── TAG FINGERPRINT ── */}
          <div style={S.chartCardFull}>
            <TagFingerprint
              data={tag_breakdown}
              title={t('stats.styleFingerprint')}
            />
          </div>

          {/* ── FLASH RATE PIE ── */}
          <div style={S.chartCardFull}>
            <FlashPie
              data={flash_by_grade}
              title={t('stats.flashByGrade')}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

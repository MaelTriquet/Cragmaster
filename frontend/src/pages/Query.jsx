import { useState } from "react"
import { useTranslation } from 'react-i18next'
import api from '../api/client'

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
    maxWidth: "1000px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "var(--title-2xl)",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: "0 0 0.5rem 0",
    lineHeight: 0.95,
  },
  textarea: {
    width: "100%",
    background: "var(--granite)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "monospace",
    fontSize: "0.9rem",
    padding: "1rem",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "120px",
    transition: "border-color 0.15s",
  },
  btnPrimary: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.6rem 1.2rem",
    background: "var(--hold)",
    color: "var(--chalk)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  error: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.85rem",
    color: "var(--hold-lt)",
    marginTop: "1rem",
    whiteSpace: "pre-wrap",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    background: "var(--granite)",
  },
  th: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    border: "1px solid var(--line)",
    padding: "0.5rem 0.75rem",
    textAlign: "left",
  },
  td: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.82rem",
    color: "var(--chalk)",
    border: "1px solid var(--line)",
    padding: "0.4rem 0.75rem",
  },
  noResults: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    color: "var(--muted)",
  },
}

export default function Query() {
  const { t } = useTranslation()
  const [sql, setSql] = useState("")
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(null)

  const executeQuery = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/query", { sql })
      setRows(res.data.rows || [])
    } catch (err) {
      setError(err.response?.data?.error || err.message || t('query.unknownError'))
      setRows([])
    }
    setLoading(false)
  }

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.container}>
        <div style={S.header}>
          <h1 style={S.title}>{t('query.title')}</h1>
        </div>

        <textarea
          value={sql}
          onChange={e => setSql(e.target.value)}
          placeholder={t('query.placeholder')}
          rows={8}
          style={S.textarea}
          onFocus={e => e.target.style.borderColor = "var(--hold)"}
          onBlur={e => e.target.style.borderColor = "var(--line)"}
        />

        <button
          onClick={executeQuery}
          disabled={loading}
          style={{
            ...S.btnPrimary,
            marginTop: "1rem",
            background: loading ? "var(--muted)" : hovered === "exec" ? "var(--hold-lt)" : "var(--hold)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={() => setHovered("exec")}
          onMouseLeave={() => setHovered(null)}
        >
          {loading ? t('query.running') : t('query.execute')}
        </button>

        {error && <div style={S.error}>{error}</div>}

        <div style={{ marginTop: "2rem" }}>
          {rows.length === 0
            ? <p style={S.noResults}>{t('query.noResults')}</p>
            : (
              <table style={S.table}>
                <thead>
                  <tr>
                    {Object.keys(rows[0]).map(col => (
                      <th key={col} style={S.th}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {Object.keys(rows[0]).map(col => (
                        <td key={col} style={S.td}>{String(row[col])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  )
}

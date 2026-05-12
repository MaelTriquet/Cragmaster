import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
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
    maxWidth: "480px",
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "60vh",
  },
  header: {
    borderLeft: "4px solid var(--hold)",
    paddingLeft: "1.5rem",
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
    fontSize: "var(--title-3xl)",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: "0",
    lineHeight: 0.95,
  },
  card: {
    background: "var(--granite)",
    borderLeft: "2px solid var(--line)",
    padding: "1.5rem 1.75rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    marginBottom: "1rem",
  },
  label: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
  },
  input: {
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.95rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
    boxSizing: "border-box",
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
    width: "100%",
    marginTop: "0.5rem",
  },
  error: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "var(--hold-lt)",
    padding: "0.4rem 0.75rem",
    borderLeft: "2px solid var(--hold)",
    background: "rgba(200,80,42,0.08)",
    marginBottom: "1rem",
  },
  warning: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "#d4c86a",
    padding: "0.4rem 0.75rem",
    borderLeft: "2px solid #d4c86a",
    background: "rgba(200,180,60,0.08)",
    marginBottom: "1rem",
  },
  queryContainer: {
    width: "100%",
    maxWidth: "1000px",
    position: "relative",
    zIndex: 1,
  },
  queryHeader: {
    marginBottom: "2rem",
  },
  queryTitle: {
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
}

function focusStyle(e) { e.target.style.borderColor = "var(--hold)" }
function blurStyle(e)  { e.target.style.borderColor = "var(--line)" }

export default function Query() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [authorized, setAuthorized] = useState(false)
  const [gateUsername, setGateUsername] = useState("")
  const [gatePassword, setGatePassword] = useState("")
  const [gateError, setGateError] = useState(null)
  const [gateWarning, setGateWarning] = useState(null)
  const [gateLoading, setGateLoading] = useState(false)

  const [sql, setSql] = useState("")
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(null)

  const inputRef = useRef()

  useEffect(() => {
    if (!authorized) inputRef.current?.focus()
  }, [authorized])

  const handleGate = async () => {
    if (!gateUsername.trim() || !gatePassword) return
    setGateLoading(true)
    setGateError(null)
    setGateWarning(null)
    try {
      const res = await api.post("/query/gate", { username: gateUsername.trim(), password: gatePassword })
      if (res.data.authorized) {
        if (res.data.is_admin) {
          setAuthorized(true)
        } else {
          setGateWarning("Your account does not have admin access.")
          setTimeout(() => navigate("/topos"), 2000)
        }
      } else {
        if (res.data.banned) {
          localStorage.removeItem("token")
          setGateError("Wrong credentials. Account banned for 3 days.")
          setTimeout(() => navigate("/login"), 2000)
        } else {
          setGateError("Invalid username or password.")
        }
      }
    } catch (err) {
      setGateError(err.response?.data?.error || "An error occurred")
    } finally {
      setGateLoading(false)
    }
  }

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

  if (!authorized) {
    return (
      <div style={S.root}>
        <div style={S.noise} />
        <div style={S.container}>
          <div style={S.header}>
            <span style={S.eyebrow}>Admin</span>
            <h1 style={S.title}>Query</h1>
          </div>
          <div style={S.card}>
            {gateError && <div style={S.error}>{gateError}</div>}
            {gateWarning && <div style={S.warning}>{gateWarning}</div>}
            <div style={S.field}>
              <label style={S.label}>Username</label>
              <input
                ref={inputRef}
                type="text"
                style={S.input}
                value={gateUsername}
                onChange={e => setGateUsername(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                onKeyDown={e => e.key === "Enter" && handleGate()}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input
                type="password"
                style={S.input}
                value={gatePassword}
                onChange={e => setGatePassword(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                onKeyDown={e => e.key === "Enter" && handleGate()}
              />
            </div>
            <button
              style={{
                ...S.btnPrimary,
                background: gateLoading ? "var(--muted)" : hovered === "gate" ? "var(--hold-lt)" : "var(--hold)",
                cursor: gateLoading ? "not-allowed" : "pointer",
              }}
              disabled={gateLoading}
              onMouseEnter={() => setHovered("gate")}
              onMouseLeave={() => setHovered(null)}
              onClick={handleGate}
            >
              {gateLoading ? "Checking\u2026" : "Authenticate"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.queryContainer}>
        <div style={S.queryHeader}>
          <h1 style={S.queryTitle}>{t('query.title')}</h1>
        </div>

        <textarea
          value={sql}
          onChange={e => setSql(e.target.value)}
          placeholder={t('query.placeholder')}
          rows={8}
          style={S.textarea}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />

        <button
          onClick={executeQuery}
          disabled={loading}
          style={{
            ...S.btnPrimary,
            width: "auto",
            background: loading ? "var(--muted)" : hovered === "exec" ? "var(--hold-lt)" : "var(--hold)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={() => setHovered("exec")}
          onMouseLeave={() => setHovered(null)}
        >
          {loading ? t('query.running') : t('query.execute')}
        </button>

        {error && (
          <div style={{ ...S.error, marginTop: "1rem" }}>{error}</div>
        )}

        <div style={{ marginTop: "2rem" }}>
          {rows.length === 0
            ? <p style={{ fontFamily: "Barlow Condensed", fontSize: "0.85rem", color: "var(--muted)" }}>{t('query.noResults')}</p>
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

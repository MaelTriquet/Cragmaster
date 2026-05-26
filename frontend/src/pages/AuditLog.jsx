import { useEffect, useState, useMemo } from "react"
import { useTranslation } from 'react-i18next'
import api from '../api/client'
import { useAuth } from '../contexts/AuthContext'

const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    padding: 'var(--page-padding)',
    maxWidth: '960px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '1.5rem',
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
  titleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--title-2xl)',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    lineHeight: 1,
  },
  count: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--muted)',
  },
  filters: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
    alignItems: 'center',
  },
  input: {
    background: 'var(--granite)',
    border: '1px solid var(--line)',
    color: 'var(--chalk)',
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    padding: '0.45rem 0.75rem',
    outline: 'none',
    minWidth: '180px',
    flex: '1 1 200px',
  },
  select: {
    background: 'var(--granite)',
    border: '1px solid var(--line)',
    color: 'var(--chalk)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.45rem 0.75rem',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '120px',
    flex: '0 1 auto',
  },
  clearBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    background: 'none',
    border: '1px solid var(--line)',
    padding: '0.45rem 0.75rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    textAlign: 'left',
    padding: '0.6rem 0.75rem',
    borderBottom: '1px solid var(--line)',
  },
  tr: (hovered) => ({
    cursor: 'pointer',
    transition: 'background 0.1s',
    background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
  }),
  td: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.82rem',
    color: 'var(--chalk)',
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'top',
  },
  tdMuted: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'top',
  },
  actionBadge: (action) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '0.15rem 0.4rem',
    display: 'inline-block',
    background: action === 'delete' ? 'rgba(200,80,42,0.15)' : action === 'insert' ? 'rgba(120,180,80,0.15)' : 'rgba(74,143,168,0.15)',
    color: action === 'delete' ? 'var(--hold-lt)' : action === 'insert' ? '#78b450' : '#4a8fa8',
    border: `1px solid ${action === 'delete' ? 'var(--hold)' : action === 'insert' ? '#78b450' : '#4a8fa8'}`,
  }),
  expandedRow: {
    background: 'var(--granite)',
  },
  expandedCell: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--line)',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '0.35rem 1rem',
    fontSize: '0.82rem',
  },
  detailLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    whiteSpace: 'nowrap',
  },
  detailValue: {
    fontFamily: 'Barlow, sans-serif',
    color: 'var(--chalk)',
    wordBreak: 'break-word',
    minWidth: 0,
  },
  arrow: {
    color: 'var(--line)',
    margin: '0 0.3rem',
  },
  empty: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    textAlign: 'center',
    padding: '4rem 0',
  },
  timestamp: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.75rem',
    color: 'var(--muted)',
    whiteSpace: 'nowrap',
  },
  restoreBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '0.35rem 0.75rem',
    cursor: 'pointer',
    border: '1px solid var(--good)',
    color: 'var(--good)',
    background: 'rgba(120,180,80,0.08)',
    transition: 'background 0.15s',
    marginTop: '0.5rem',
  },
  restoreMsg: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    padding: '0.35rem 0.75rem',
    marginTop: '0.5rem',
  },
}

export default function AuditLog() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTable, setFilterTable] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [restoringId, setRestoringId] = useState(null)
  const [restoreMsg, setRestoreMsg] = useState(null)

  useEffect(() => {
    api.get('/admin/audit-log').then(res => {
      setLogs(res.data.logs || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const tables = useMemo(() => {
    const s = new Set(logs.map(l => l.table_name))
    return [...s].sort()
  }, [logs])

  const users = useMemo(() => {
    const s = new Set(logs.filter(l => l.username).map(l => l.username))
    return [...s].sort()
  }, [logs])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return logs.filter(l => {
      if (filterTable && l.table_name !== filterTable) return false
      if (filterAction && l.action !== filterAction) return false
      if (filterUser && l.username !== filterUser) return false
      if (q) {
        const haystack = [l.table_name, l.action, l.field_name, l.old_value, l.new_value, l.summary, l.username]
          .filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(q)
      }
      return true
    })
  }, [logs, search, filterTable, filterAction, filterUser])

  const clearFilters = () => {
    setSearch('')
    setFilterTable('')
    setFilterAction('')
    setFilterUser('')
  }

  const handleRestore = async (log) => {
    if (!confirm(t('auditLog.restoreConfirm'))) return
    setRestoringId(log.id)
    setRestoreMsg(null)
    try {
      const res = await api.post(`/admin/audit-log/${log.id}/restore`)
      setRestoreMsg({ id: log.id, ok: true, msg: res.data.message || t('auditLog.restoreOk') })
      // Refresh logs
      const r2 = await api.get('/admin/audit-log')
      setLogs(r2.data.logs || [])
    } catch (err) {
      setRestoreMsg({ id: log.id, ok: false, msg: err.response?.data?.error || err.message })
    } finally {
      setRestoringId(null)
    }
  }

  const fmtTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts.replace(' ', 'T') + 'Z')
    if (isNaN(d.getTime())) return ts
    return d.toLocaleString()
  }

  if (loading) return (
    <div style={{ ...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Barlow Condensed', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--muted)' }}>
        {t('common.loading')}
      </span>
    </div>
  )

  return (
    <div style={S.root}>
      <div style={S.header}>
        <span style={S.eyebrow}>{user.is_admin ? t('auditLog.eyebrow') : t('auditLog.myChangesEyebrow')}</span>
        <div style={S.titleRow}>
          <h1 style={S.title}>{user.is_admin ? t('auditLog.title') : t('auditLog.myChangesTitle')}</h1>
          <span style={S.count}>{t('auditLog.count', { total: logs.length, shown: filtered.length })}</span>
        </div>
      </div>

      <div style={S.filters}>
        <input
          type="text"
          placeholder={t('auditLog.searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={S.input}
        />
        <select value={filterTable} onChange={e => setFilterTable(e.target.value)} style={S.select}>
          <option value="">{t('auditLog.allTables')}</option>
          {tables.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)} style={S.select}>
          <option value="">{t('auditLog.allActions')}</option>
          <option value="insert">{t('auditLog.actionInsert')}</option>
          <option value="update">{t('auditLog.actionUpdate')}</option>
          <option value="delete">{t('auditLog.actionDelete')}</option>
        </select>
        {user?.is_admin && (
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={S.select}>
            <option value="">{t('auditLog.allUsers')}</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        )}
        {(search || filterTable || filterAction || filterUser) && (
          <button style={S.clearBtn} onClick={clearFilters}>{t('auditLog.clear')}</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={S.empty}>{t('auditLog.empty')}</div>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>{t('auditLog.colTime')}</th>
              <th style={S.th}>{t('auditLog.colUser')}</th>
              <th style={S.th}>{t('auditLog.colAction')}</th>
              <th style={S.th}>{t('auditLog.colDetails')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => {
              const expanded = expandedId === log.id
              return (
                <tr key={log.id}>
                  <td colSpan={4} style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr
                          style={S.tr(expanded)}
                          onClick={() => setExpandedId(expanded ? null : log.id)}
                        >
                            <td style={S.timestamp}>{fmtTime(log.timestamp)}</td>
                            <td style={S.tdMuted}>{log.username || '—'}</td>
                            <td style={S.td}>
                              <span style={S.actionBadge(log.action)}>{log.action}</span>
                              <span style={{ marginLeft: '0.4rem', color: 'var(--muted)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                {log.table_name}
                                {log.row_id ? ` #${log.row_id}` : ''}
                              </span>
                            </td>
                            <td style={S.td}>
                              {log.summary ? (
                                <span>{log.summary}</span>
                              ) : (
                                <span>
                                  {log.field_name && (
                                    <span style={{ color: 'var(--muted)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                      {log.field_name}
                                    </span>
                                  )}
                                  {log.field_name && log.old_value != null && (
                                    <>
                                      <span style={{ color: 'var(--hold-lt)' }}> "{log.old_value}"</span>
                                      <span style={S.arrow}>→</span>
                                      <span style={{ color: 'var(--good)' }}>"{log.new_value}"</span>
                                    </>
                                  )}
                                </span>
                              )}
                            </td>
                          </tr>
                          {expanded && (
                            <tr onClick={e => e.stopPropagation()}>
                              <td colSpan={4} style={S.expandedCell}>
                                <div style={S.detailGrid}>
                                  <span style={S.detailLabel}>{t('auditLog.detailTimestamp')}</span>
                                  <span style={S.detailValue}>{fmtTime(log.timestamp)}</span>
                                  <span style={S.detailLabel}>{t('auditLog.detailUser')}</span>
                                  <span style={S.detailValue}>{log.username || '—'} {log.user_id ? `(#${log.user_id})` : ''}</span>
                                  <span style={S.detailLabel}>{t('auditLog.detailTable')}</span>
                                  <span style={S.detailValue}>{log.table_name}{log.row_id ? ` #${log.row_id}` : ''}</span>
                                  <span style={S.detailLabel}>{t('auditLog.detailAction')}</span>
                                  <span style={S.detailValue}><span style={S.actionBadge(log.action)}>{log.action}</span></span>
                                  {log.field_name && (
                                    <>
                                      <span style={S.detailLabel}>{t('auditLog.detailField')}</span>
                                      <span style={S.detailValue}>{log.field_name}</span>
                                    </>
                                  )}
                                  {log.old_value != null && (
                                    <>
                                      <span style={S.detailLabel}>{t('auditLog.detailOld')}</span>
                                      <span style={{ ...S.detailValue, color: 'var(--hold-lt)' }}>{log.old_value || '(empty)'}</span>
                                    </>
                                  )}
                                  {log.new_value != null && (
                                    <>
                                      <span style={S.detailLabel}>{t('auditLog.detailNew')}</span>
                                      <span style={{ ...S.detailValue, color: 'var(--good)' }}>{log.new_value || '(empty)'}</span>
                                    </>
                                  )}
                                  {log.summary && (
                                    <>
                                      <span style={S.detailLabel}>{t('auditLog.detailSummary')}</span>
                                      <span style={S.detailValue}>{log.summary}</span>
                                    </>
                                  )}
                                </div>
                                {log.action !== 'insert' && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px solid var(--line)', paddingTop: '0.75rem' }}>
                                  <button
                                    style={S.restoreBtn}
                                    onClick={() => handleRestore(log)}
                                    disabled={restoringId === log.id}
                                    onMouseEnter={e => { if (restoringId !== log.id) e.currentTarget.style.background = 'rgba(120,180,80,0.2)' }}
                                    onMouseLeave={e => { if (restoringId !== log.id) e.currentTarget.style.background = 'rgba(120,180,80,0.08)' }}
                                  >
                                    {restoringId === log.id ? t('auditLog.restoring') : t('auditLog.restore')}
                                  </button>
                                  {restoreMsg?.id === log.id && (
                                    <span style={{
                                      ...S.restoreMsg,
                                      color: restoreMsg.ok ? 'var(--good)' : 'var(--hold-lt)',
                                    }}>
                                      {restoreMsg.ok ? '\u2713 ' : '\u2717 '}{restoreMsg.msg}
                                    </span>
                                  )}
                                </div>
                              )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

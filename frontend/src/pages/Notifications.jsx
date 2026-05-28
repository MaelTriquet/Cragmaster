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
import { useTranslation } from 'react-i18next'
import api from '../api/client'

const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    padding: 'var(--page-padding)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
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
    fontSize: 'var(--title-2xl)',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    lineHeight: 1,
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
  card: {
    background: 'var(--granite)',
    padding: '1.25rem 1.5rem',
    marginBottom: '0.75rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  cardResolved: {
    opacity: 0.4,
  },
  typeBadge: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0.2rem 0.5rem',
    flexShrink: 0,
    marginTop: '0.15rem',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  bodyText: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    color: 'var(--chalk)',
    marginBottom: '0.4rem',
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  meta: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'var(--muted)',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexShrink: 0,
    paddingTop: '0.1rem',
  },
  actionBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    background: 'none',
    border: '1px solid var(--line)',
    padding: '0.35rem 0.6rem',
    color: 'var(--muted)',
    transition: 'border-color 0.15s, color 0.15s',
  },
  resolvedLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--hold)',
    padding: '0.25rem 0',
  },
  filterRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
  },
  filterBtn: (active) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    background: active ? 'var(--hold)' : 'none',
    border: '1px solid var(--line)',
    padding: '0.3rem 0.75rem',
    color: active ? 'var(--chalk)' : 'var(--muted)',
    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
  }),
}

function NotificationCard({ item, onResolve, onDelete }) {
  const { t } = useTranslation()
  const isReport = item.type === 'report'

  return (
    <div style={{ ...S.card, ...(item.resolved ? S.cardResolved : {}) }}>
      <div style={{
        ...S.typeBadge,
        background: isReport ? 'rgba(200,80,42,0.2)' : 'rgba(160,200,80,0.2)',
        color: isReport ? 'var(--hold-lt)' : '#80c850',
      }}>
        {isReport ? t('notifications.reportLabel') : t('notifications.notifLabel')}
      </div>
      <div style={S.body}>
        {isReport ? (
          <>
            <div style={S.bodyText}>{item.explanation}</div>
            {item.concerned_user && <div style={S.meta}>User: {item.concerned_user}</div>}
          </>
        ) : (
          <>
            <div style={S.bodyText}>{item.body}</div>
            {item.category && <div style={S.meta}>{t(`footer.category_${item.category}`)}</div>}
          </>
        )}
        <div style={{ ...S.meta, marginTop: '0.3rem' }}>
          {t('notifications.from')} {item.submitter_name || t('notifications.unknownUser')} &middot; {item.created_at}
        </div>
      </div>
      <div style={S.actions}>
        {item.resolved ? (
          <div style={S.resolvedLabel}>{t('notifications.resolved')}</div>
        ) : (
          <button
            style={S.actionBtn}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hold)'; e.currentTarget.style.color = 'var(--hold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)' }}
            onClick={() => onResolve(item)}
          >
            {t('notifications.resolve')}
          </button>
        )}
        <button
          style={S.actionBtn}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hold-lt)'; e.currentTarget.style.color = 'var(--hold-lt)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--muted)' }}
          onClick={() => onDelete(item)}
        >
          {t('notifications.delete')}
        </button>
      </div>
    </div>
  )
}

export default function Notifications() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('unresolved')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/notifications')
      setItems(res.data.items)
    } catch (e) {
      if (e.response?.status !== 403) setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const handleResolve = async (item) => {
    await api.patch(`/admin/notifications/${item.type}/${item.id}/resolve`)
    fetchItems()
  }

  const handleDelete = async (item) => {
    await api.delete(`/admin/notifications/${item.type}/${item.id}`)
    fetchItems()
  }

  const filtered = items
    .filter(item => {
      if (filter === 'unresolved') return !item.resolved
      if (filter === 'resolved') return item.resolved
      if (filter === 'notification') return item.type === 'notification'
      if (filter === 'report') return item.type === 'report'
      return true
    })
    .sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved - b.resolved
      return a.created_at < b.created_at ? 1 : -1
    })

  const unresolvedCount = items.filter(i => !i.resolved).length

  return (
    <div style={S.root}>
      <div style={S.header}>
        <span style={S.eyebrow}>{t('notifications.eyebrow')}</span>
        <h1 style={S.title}>
          {t('notifications.title')}
          {unresolvedCount > 0 && (
            <span style={{ color: 'var(--hold)', fontSize: '0.6em', marginLeft: '0.6rem' }}>
              ({unresolvedCount})
            </span>
          )}
        </h1>
      </div>

      <div style={S.filterRow}>
        {['unresolved', 'resolved', 'report'].map(f => (
          <button
            key={f}
            style={S.filterBtn(filter === f)}
            onClick={() => setFilter(f)}
          >
            {t(`notifications.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={S.empty}>{t('common.loading')}</div>
      ) : filtered.length === 0 ? (
        <div style={S.empty}>{t('notifications.empty')}</div>
      ) : (
        filtered.map(item => (
          <NotificationCard
            key={`${item.type}-${item.id}`}
            item={item}
            onResolve={handleResolve}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  )
}

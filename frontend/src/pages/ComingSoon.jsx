import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/client'

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
    maxWidth: '640px',
    position: 'relative',
    zIndex: 1,
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
    fontSize: 'var(--title-3xl)',
    fontWeight: 800,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: '0 0 1rem 0',
    lineHeight: 0.95,
  },
  titleUnderline: {
    width: '2.5rem',
    height: '3px',
    background: 'var(--hold)',
  },
  toolbar: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
    alignItems: 'center',
  },
  sortLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginRight: '0.25rem',
  },
  sortBtn: (active) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: active ? 'var(--chalk)' : 'var(--muted)',
    background: 'none',
    border: active ? '1px solid var(--hold)' : '1px solid var(--line)',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  }),
  addBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    background: 'var(--hold)',
    border: 'none',
    padding: '0.35rem 0.75rem',
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'background 0.15s',
  },
  formCard: {
    borderLeft: '2px solid var(--hold)',
    padding: '1.25rem 1.5rem',
    marginBottom: '1.5rem',
    background: 'var(--granite)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 300,
    color: 'var(--chalk)',
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    padding: '0.5rem 0.75rem',
    outline: 'none',
  },
  textarea: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 300,
    color: 'var(--chalk)',
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    padding: '0.5rem 0.75rem',
    outline: 'none',
    resize: 'vertical',
    minHeight: '4rem',
  },
  formActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    background: 'var(--hold)',
    border: 'none',
    padding: '0.4rem 0.85rem',
    cursor: 'pointer',
  },
  cancelBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    background: 'none',
    border: '1px solid var(--line)',
    padding: '0.4rem 0.85rem',
    cursor: 'pointer',
  },
  feature: {
    borderLeft: '2px solid var(--line)',
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
    background: 'var(--granite)',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  voteCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.15rem',
    flexShrink: 0,
    minWidth: '2.5rem',
  },
  voteBtn: (myVote, dir) => ({
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.9rem',
    lineHeight: 1,
    color: myVote === dir ? 'var(--hold-lt)' : 'var(--muted)',
    background: 'none',
    border: 'none',
    padding: '0.15rem 0',
    cursor: 'pointer',
    transition: 'color 0.1s',
  }),
  voteCount: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--chalk)',
    lineHeight: 1,
  },
  featureBody: {
    flex: 1,
    minWidth: 0,
  },
  featureTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: 'var(--chalk)',
    margin: 0,
    lineHeight: 1.3,
  },
  featureDesc: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 300,
    color: 'var(--muted)',
    lineHeight: 1.5,
    margin: '0.25rem 0 0.35rem',
    whiteSpace: 'pre-wrap',
  },
  featureMeta: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  deleteBtn: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    background: 'none',
    border: '1px solid var(--line)',
    padding: '0.2rem 0.45rem',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  empty: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    textAlign: 'center',
    padding: '2rem 0',
  },
}

export default function ComingSoon() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [features, setFeatures] = useState([])
  const [sort, setSort] = useState('upvotes')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    api.get('/coming-soon').then(res => {
      setFeatures(res.data.items || [])
    }).catch(() => {})
  }, [])

  const sorted = useMemo(() => {
    const list = [...features]
    switch (sort) {
      case 'upvotes': list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)); break
      case 'downvotes': list.sort((a, b) => (b.downvotes || 0) - (a.downvotes || 0)); break
      case 'newest': list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break
      case 'oldest': list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break
    }
    return list
  }, [features, sort])

  const handleVote = (fid, vote) => {
    api.post(`/coming-soon/${fid}/vote`, { vote }).then(res => {
      setFeatures(prev => prev.map(f => {
        if (f.id !== fid) return f
        const oldVote = f.my_vote
        const up = f.upvotes || 0
        const down = f.downvotes || 0
        if (oldVote === 1) f.upvotes = up - 1
        if (oldVote === -1) f.downvotes = down - 1
        if (vote === 1) f.upvotes = (f.upvotes || 0) + 1
        if (vote === -1) f.downvotes = (f.downvotes || 0) + 1
        return { ...f, my_vote: res.data.vote, upvotes: f.upvotes, downvotes: f.downvotes }
      }))
    }).catch(() => {})
  }

  const handleAdd = () => {
    if (!title.trim()) return
    setAdding(true)
    api.post('/coming-soon', { title: title.trim(), description: description.trim() }).then(res => {
      setFeatures(prev => [res.data, ...prev])
      setTitle('')
      setDescription('')
      setShowForm(false)
    }).catch(() => {}).finally(() => setAdding(false))
  }

  const handleDelete = (fid) => {
    api.delete(`/coming-soon/${fid}`).then(() => {
      setFeatures(prev => prev.filter(f => f.id !== fid))
    }).catch(() => {})
  }

  const sortOptions = [
    { key: 'upvotes', label: t('comingSoon.sortUpvotes') },
    { key: 'downvotes', label: t('comingSoon.sortDownvotes') },
    { key: 'newest', label: t('comingSoon.sortNewest') },
    { key: 'oldest', label: t('comingSoon.sortOldest') },
  ]

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>
        <div style={S.header}>
          <span style={S.eyebrow}>{t('comingSoon.eyebrow')}</span>
          <h1 style={S.title}>{t('comingSoon.title')}</h1>
          <div style={S.titleUnderline} />
        </div>

        <div style={S.toolbar}>
          <span style={S.sortLabel}>{t('comingSoon.sortBy')}</span>
          {sortOptions.map(o => (
            <button key={o.key} style={S.sortBtn(sort === o.key)} onClick={() => setSort(o.key)}>
              {o.label}
            </button>
          ))}
          {user?.is_admin && !showForm && (
            <button style={S.addBtn} onClick={() => setShowForm(true)}>
              {t('comingSoon.addFeature')}
            </button>
          )}
        </div>

        {showForm && (
          <div style={S.formCard}>
            <input
              style={S.input}
              placeholder={t('comingSoon.titlePlaceholder')}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              style={S.textarea}
              placeholder={t('comingSoon.descPlaceholder')}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <div style={S.formActions}>
              <button style={S.cancelBtn} onClick={() => { setShowForm(false); setTitle(''); setDescription('') }}>
                {t('common.cancel')}
              </button>
              <button style={S.submitBtn} onClick={handleAdd} disabled={adding}>
                {adding ? t('common.loading') : t('comingSoon.submit')}
              </button>
            </div>
          </div>
        )}

        {sorted.length === 0 ? (
          <p style={S.empty}>{t('comingSoon.empty')}</p>
        ) : sorted.map(f => (
          <div key={f.id} style={S.feature}>
            <div style={S.voteCol}>
              <button
                style={S.voteBtn(f.my_vote, 1)}
                onClick={() => handleVote(f.id, f.my_vote === 1 ? 0 : 1)}
              >▲</button>
              <span style={S.voteCount}>{(f.upvotes || 0) - (f.downvotes || 0)}</span>
              <button
                style={S.voteBtn(f.my_vote, -1)}
                onClick={() => handleVote(f.id, f.my_vote === -1 ? 0 : -1)}
              >▼</button>
            </div>
            <div style={S.featureBody}>
              <h3 style={S.featureTitle}>{f.title}</h3>
              {f.description && <p style={S.featureDesc}>{f.description}</p>}
              <div style={S.featureMeta}>
                <span>{f.created_by_username}</span>
                <span>{new Date(f.created_at).toLocaleDateString()}</span>
                <span>{t('comingSoon.upvotes', { count: f.upvotes || 0 })}</span>
                <span>{t('comingSoon.downvotes', { count: f.downvotes || 0 })}</span>
              </div>
            </div>
            {user?.is_admin && (
              <button style={S.deleteBtn} onClick={() => handleDelete(f.id)}>
                {t('comingSoon.delete')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

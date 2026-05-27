import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    padding: 'var(--page-padding)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4rem',
  },

  /* ── Header ── */
  header: {
    width: '100%',
    maxWidth: '620px',
    marginBottom: '3rem',
    position: 'relative',
    paddingLeft: '1.5rem',
  },
  headerAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'var(--hold)',
  },
  eyebrow: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.28em',
    color: 'var(--hold)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.6rem',
  },
  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--title-2xl)',
    fontWeight: 900,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: 0,
    lineHeight: 0.95,
  },
  subtitle: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    color: 'var(--muted)',
    marginTop: '0.75rem',
    lineHeight: 1.5,
  },

  /* ── Card ── */
  card: {
    width: '100%',
    maxWidth: '620px',
    background: 'var(--granite)',
    padding: 'var(--card-padding)',
    boxShadow: '0 8px 60px rgba(0,0,0,0.45)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  /* ── Section label ── */
  sectionLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '0.6rem',
  },

  /* ── Dropzone ── */
  dropzone: (active) => ({
    border: `1px solid ${active ? 'var(--hold)' : 'var(--line)'}`,
    background: active ? 'rgba(200,80,42,0.06)' : 'var(--rock)',
    padding: '2.25rem 2rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  }),
  dropIconWrap: {
    fontSize: '2rem',
    lineHeight: 1,
    flexShrink: 0,
    opacity: 0.85,
  },
  dropBody: {
    flex: 1,
  },
  dropText: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: 0,
  },
  dropSub: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.78rem',
    color: 'var(--muted)',
    marginTop: '0.3rem',
  },
  dropCorner: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.75rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--hold)',
    opacity: 0.7,
  },
  fileList: {
    marginTop: '0.6rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  fileName: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--hold-lt)',
    letterSpacing: '0.05em',
  },

  /* ── Divider ── */
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--line)',
  },
  dividerText: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },

  /* ── URL import ── */
  urlRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  urlIcon: {
    fontSize: '1.25rem',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    paddingRight: '0.25rem',
    opacity: 0.75,
  },
  urlInput: {
    flex: 1,
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    padding: '0.7rem 1rem',
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.82rem',
    color: 'var(--chalk)',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  urlBtn: (disabled) => ({
    background: 'var(--hold)',
    color: 'var(--chalk)',
    border: 'none',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0 1.4rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.35 : 1,
    flexShrink: 0,
    transition: 'background 0.15s',
  }),

  /* ── Submit ── */
  submitWrap: {
    borderTop: '1px solid var(--line)',
    paddingTop: '1.5rem',
  },
  btn: {
    width: '100%',
    background: 'var(--hold)',
    color: 'var(--chalk)',
    border: 'none',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 800,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  btnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },

  /* ── Progress ── */
  progressList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  progressItem: {
    background: 'var(--rock)',
    borderLeft: '3px solid var(--line)',
    padding: '0.85rem 1rem',
    transition: 'border-color 0.3s',
  },
  progressItemActive: {
    borderLeftColor: 'var(--hold)',
  },
  progressItemDone: {
    borderLeftColor: 'var(--good)',
  },
  progressItemError: {
    borderLeftColor: 'var(--hold)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.55rem',
  },
  progressName: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.07em',
    color: 'var(--chalk)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '72%',
  },
  progressStatus: (status) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color:
      status === 'done'  ? '#7fc99a' :
      status === 'error' ? 'var(--hold-lt)' :
      status === 'ocr'   ? 'var(--chalk)' :
      'var(--muted)',
    flexShrink: 0,
  }),
  progressBarOuter: {
    background: 'var(--line)',
    height: '2px',
    width: '100%',
  },
  progressBarInner: (pct, status) => ({
    height: '100%',
    width: `${pct}%`,
    background: status === 'done' ? 'var(--good)' : 'var(--hold)',
    transition: 'width 0.3s ease',
  }),
  progressMsg: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.72rem',
    color: 'var(--muted)',
    marginTop: '0.4rem',
    lineHeight: 1.4,
  },

  /* ── Summary ── */
  summary: {
    borderLeft: '3px solid var(--good)',
    background: 'rgba(90,158,111,0.07)',
    padding: '1.1rem 1.4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  summaryTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    color: '#7fc99a',
    textTransform: 'uppercase',
    margin: 0,
  },
  summaryBody: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.85rem',
    color: 'var(--chalk)',
    margin: 0,
  },
  summaryLink: {
    display: 'inline-block',
    marginTop: '0.4rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--hold-lt)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
}

function Dots() {
  return (
    <span style={{ display: 'inline-block', width: '1.5rem', textAlign: 'left' }}>
      <style>{`
        @keyframes dot { 0%,80%,100%{opacity:0} 40%{opacity:1} }
        .d1{animation:dot 1.4s infinite .0s}
        .d2{animation:dot 1.4s infinite .2s}
        .d3{animation:dot 1.4s infinite .4s}
      `}</style>
      <span className="d1">.</span>
      <span className="d2">.</span>
      <span className="d3">.</span>
    </span>
  )
}

function progressItemStyle(status) {
  if (status === 'done')  return { ...S.progressItem, ...S.progressItemDone }
  if (status === 'error') return { ...S.progressItem, ...S.progressItemError }
  if (status === 'uploading' || status === 'ocr') return { ...S.progressItem, ...S.progressItemActive }
  return S.progressItem
}

export default function Upload() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef()

  const statusLabel = (status, entry) => {
    if (entry?._isUrl && status === 'uploading') return t('upload.fetching')
    switch (status) {
      case 'uploading': return t('upload.uploading')
      case 'ocr':       return <>{t('upload.ocr')}<Dots /></>
      case 'done':      return t('upload.done')
      case 'error':     return t('upload.failed')
      default:          return t('upload.pending')
    }
  }

  const [files,    setFiles]    = useState([])
  const [dragging, setDragging] = useState(false)
  const [busy,     setBusy]     = useState(false)
  const [allDone,  setAllDone]  = useState(false)
  const [url,      setUrl]      = useState('')
  const [emptyName, setEmptyName] = useState('')
  const [creatingEmpty, setCreatingEmpty] = useState(false)
  const [createdTopoId, setCreatedTopoId] = useState(null)
  const [fileStates, setFileStates] = useState([])

  const pickFiles = (selected) => {
    const pdfs = selected.filter(f => f.type === 'application/pdf')
    setFiles(pdfs)
    setFileStates(pdfs.map(f => ({ name: f.name, status: 'pending', progress: 0, message: '', routes_parsed: null })))
    setAllDone(false)
  }

  const updateFile = (index, patch) => {
    setFileStates(prev => prev.map((s, i) => i === index ? { ...s, ...patch } : s))
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    pickFiles(Array.from(e.dataTransfer.files))
  }

  const submit = async () => {
    if (files.length === 0 || busy) return
    setBusy(true)
    setAllDone(false)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const title = file.name.replace(/\.pdf$/i, '')

      updateFile(i, { status: 'uploading', progress: 0, message: '' })

      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('title', title)

      try {
        updateFile(i, { status: 'ocr', progress: 100 })

        const res = await api.post('/topos/upload', formData, {
          onUploadProgress: (e) => {
            const pct = e.total ? Math.round((e.loaded / e.total) * 90) : 50
            updateFile(i, { status: 'uploading', progress: pct })
          },
        })

        updateFile(i, {
          status: 'done',
          progress: 100,
          routes_parsed: res.data.routes_parsed ?? 0,
          message: t('upload.routesParsed', { count: res.data.routes_parsed ?? 0 }),
        })
      } catch (err) {
        updateFile(i, {
          status: 'error',
          progress: 100,
          message: err.response?.data?.error || err.message || t('upload.uploadFailed'),
        })
      }
    }

    setBusy(false)
    setAllDone(true)
  }

  const submitUrl = async () => {
    const trimmed = url.trim()
    if (!trimmed || busy) return
    if (!trimmed.startsWith('https://www.thecrag.com/')) {
      alert(t('upload.invalidUrl'))
      return
    }

    const idx = fileStates.length
    setFileStates(prev => [...prev, {
      name: 'theCrag.com',
      _isUrl: true,
      status: 'uploading',
      progress: 50,
      message: '',
      routes_parsed: null,
    }])
    setBusy(true)
    setAllDone(false)
    setUrl('')

    try {
      const res = await api.post('/topos/import/thecrag/url', { url: trimmed })
      updateFile(idx, {
        status: 'done',
        progress: 100,
        routes_parsed: res.data.routes_parsed ?? 0,
        message: t('upload.routesParsed', { count: res.data.routes_parsed ?? 0 }),
      })
    } catch (err) {
      updateFile(idx, {
        status: 'error',
        progress: 100,
        message: err.response?.data?.error || err.message || t('upload.uploadFailed'),
      })
    }

    setBusy(false)
    setAllDone(true)
  }

  const createEmptyTopo = async () => {
    const title = emptyName.trim()
    if (!title || creatingEmpty) return
    setCreatingEmpty(true)
    setCreatedTopoId(null)
    try {
      const res = await api.post('/topos/create', { title })
      setCreatedTopoId(res.data.topo.id)
      setEmptyName('')
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to create topo')
    }
    setCreatingEmpty(false)
  }

  const hasFiles = files.length > 0
  const doneCount  = fileStates.filter(s => s.status === 'done').length
  const errorCount = fileStates.filter(s => s.status === 'error').length

  return (
    <div style={S.root}>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerAccent} />
        <span style={S.eyebrow}>{t('upload.eyebrow')}</span>
        <h1 style={S.title}>{t('upload.title')}</h1>
        <p style={S.subtitle}>{t('upload.subtitle')}</p>
      </div>

      {/* Card */}
      <div style={S.card}>

        {/* ── PDF section ── */}
        <div>
          <p style={S.sectionLabel}>{t('upload.sectionPdf')}</p>

          <div
            style={S.dropzone(dragging)}
            onClick={() => !busy && inputRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={e => pickFiles(Array.from(e.target.files))}
            />

            <span style={S.dropIconWrap}>{hasFiles ? '📄' : '⛰'}</span>

            <div style={S.dropBody}>
              {hasFiles ? (
                <>
                  <p style={S.dropText}>
                    {t('upload.fileSelected', { count: files.length })}
                    {!busy && <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: '0.5rem' }}>{t('upload.clickToChange')}</span>}
                  </p>
                  <div style={S.fileList}>
                    {files.map((f, i) => (
                      <p key={i} style={S.fileName}>{f.name}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p style={S.dropText}>{t('upload.dropPrompt')}</p>
                  <p style={S.dropSub}>{t('upload.dropSub')}</p>
                </>
              )}
            </div>

            {!hasFiles && (
              <span style={S.dropCorner}>{t('upload.pdfOnly')}</span>
            )}
          </div>
        </div>

        {/* Submit */}
        {hasFiles && (
          <div style={S.submitWrap}>
            <button
              style={{ ...S.btn, ...(busy ? S.btnDisabled : {}) }}
              disabled={busy}
              onClick={submit}
              onMouseEnter={e => { if (!busy) e.target.style.background = 'var(--hold-lt)' }}
              onMouseLeave={e => { if (!busy) e.target.style.background = 'var(--hold)' }}
            >
              {busy
                ? t('upload.processing', { done: fileStates.filter(s => s.status === 'done' || s.status === 'error').length, total: Math.max(files.length, fileStates.length) })
                : files.length > 1
                  ? t('upload.uploadParseFiles', { count: files.length })
                  : t('upload.uploadParse')}
            </button>
          </div>
        )}

        {/* Per-file progress */}
        {fileStates.some(s => s.status !== 'pending') && (
          <div style={S.progressList}>
            {fileStates.map((fs, i) => (
              <div key={i} style={progressItemStyle(fs.status)}>
                <div style={S.progressHeader}>
                  <span style={S.progressName}>{fs.name}</span>
                  <span style={S.progressStatus(fs.status)}>
                    {statusLabel(fs.status, fs)}
                  </span>
                </div>
                <div style={S.progressBarOuter}>
                  <div style={S.progressBarInner(fs.progress, fs.status)} />
                </div>
                {fs.message && (
                  <p style={{
                    ...S.progressMsg,
                    color: fs.status === 'error' ? 'var(--hold-lt)' : 'var(--muted)',
                  }}>
                    {fs.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {allDone && (
          <div style={S.summary}>
            <p style={S.summaryTitle}>
              {errorCount === 0
                ? t('upload.allUploaded', { count: doneCount })
                : t('upload.someUploaded', { done: doneCount, failed: errorCount })}
            </p>
            <p style={S.summaryBody}>
              {doneCount > 0 &&
                t('upload.totalRoutes', { count: fileStates.filter(s => s.status === 'done').reduce((sum, s) => sum + (s.routes_parsed ?? 0), 0) })}
            </p>
            <button style={S.summaryLink} onClick={() => navigate('/topos')}>
              {t('upload.goToList')} →
            </button>
          </div>
        )}

        {/* Divider */}
        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>{t('upload.orImport')}</span>
          <div style={S.dividerLine} />
        </div>

        {/* ── URL import section ── */}
        <div>
          <p style={S.sectionLabel}>{t('upload.sectionUrl')}</p>

          <div style={S.urlRow}>
            <span style={S.urlIcon}>🌐</span>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder={t('upload.urlPlaceholder')}
              disabled={busy}
              style={S.urlInput}
              onFocus={e => { e.target.style.borderColor = 'var(--hold)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--line)' }}
              onKeyDown={e => e.key === 'Enter' && submitUrl()}
            />
            <button
              disabled={busy || !url.trim()}
              onClick={submitUrl}
              style={S.urlBtn(busy || !url.trim())}
              onMouseEnter={e => { if (!busy && url.trim()) e.target.style.background = 'var(--hold-lt)' }}
              onMouseLeave={e => { if (!busy && url.trim()) e.target.style.background = 'var(--hold)' }}
            >
              {t('upload.importUrl')}
            </button>
          </div>
        </div>

        {/* ── Empty topo section ── */}
        <div>
          <p style={S.sectionLabel}>{t('upload.sectionEmpty')}</p>

          <div style={S.urlRow}>
            <span style={S.urlIcon}>📋</span>
            <input
              type="text"
              value={emptyName}
              onChange={e => setEmptyName(e.target.value)}
              placeholder={t('upload.emptyPlaceholder')}
              disabled={busy || creatingEmpty}
              style={S.urlInput}
              onFocus={e => { e.target.style.borderColor = 'var(--hold)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--line)' }}
              onKeyDown={e => e.key === 'Enter' && createEmptyTopo()}
            />
            {createdTopoId ? (
              <button
                style={{
                  ...S.urlBtn(false),
                  background: 'var(--good)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.target.style.background = '#6db87e' }}
                onMouseLeave={e => { e.target.style.background = 'var(--good)' }}
                onClick={() => navigate(`/topos/${createdTopoId}`)}
              >
                {t('upload.createdTopo')} →
              </button>
            ) : (
              <button
                disabled={busy || creatingEmpty || !emptyName.trim()}
                onClick={createEmptyTopo}
                style={S.urlBtn(busy || creatingEmpty || !emptyName.trim())}
                onMouseEnter={e => { if (!busy && !creatingEmpty && emptyName.trim()) e.target.style.background = 'var(--hold-lt)' }}
                onMouseLeave={e => { if (!busy && !creatingEmpty && emptyName.trim()) e.target.style.background = 'var(--hold)' }}
              >
                {creatingEmpty ? t('upload.creatingTopo') : t('upload.emptyCreate')}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

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
  },
  header: {
    width: '100%',
    maxWidth: '580px',
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
    fontSize: 'var(--title-2xl)',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: 0,
    lineHeight: 1,
  },
  rule: {
    width: '2.5rem',
    height: '3px',
    background: 'var(--hold)',
    marginTop: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '580px',
    background: 'var(--granite)',
    borderLeft: '4px solid var(--hold)',
    padding: '2rem 2.5rem',
    boxShadow: '0 0 60px rgba(0,0,0,0.5)',
  },
  dropzone: (active) => ({
    border: `2px dashed ${active ? 'var(--hold)' : 'var(--line)'}`,
    background: active ? 'rgba(200,80,42,0.07)' : 'var(--rock)',
    padding: '2.5rem 1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '1.75rem',
    position: 'relative',
  }),
  dropIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
    display: 'block',
    lineHeight: 1,
  },
  dropText: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    margin: 0,
  },
  dropSub: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.8rem',
    color: 'var(--muted)',
    marginTop: '0.35rem',
  },
  fileList: {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  fileName: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--hold-lt)',
    letterSpacing: '0.05em',
  },
  btn: {
    width: '100%',
    background: 'var(--hold)',
    color: 'var(--chalk)',
    border: 'none',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  // Per-file progress list
  progressList: {
    marginTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  progressItem: {
    border: '1px solid var(--line)',
    padding: '0.9rem 1rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  progressName: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--chalk)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '80%',
  },
  progressStatus: (status) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
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
    height: '3px',
    width: '100%',
  },
  progressBarInner: (pct, status) => ({
    height: '100%',
    width: `${pct}%`,
    background: status === 'error' ? 'var(--hold)' : status === 'done' ? '#5a9e6f' : 'var(--hold)',
    transition: 'width 0.3s ease',
  }),
  progressMsg: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    letterSpacing: '0.05em',
    color: 'var(--muted)',
    marginTop: '0.4rem',
  },
  // Done summary
  summary: {
    marginTop: '1.5rem',
    borderLeft: '4px solid #5a9e6f',
    background: 'rgba(90,158,111,0.08)',
    padding: '1rem 1.25rem',
  },
  summaryTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#7fc99a',
    textTransform: 'uppercase',
    margin: '0 0 0.3rem',
  },
  summaryBody: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.9rem',
    color: 'var(--chalk)',
    margin: 0,
  },
  summaryLink: {
    display: 'inline-block',
    marginTop: '0.75rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
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

export default function Upload() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef()

  const statusLabel = (status) => {
    switch (status) {
      case 'uploading': return t('upload.uploading')
      case 'ocr':       return <>OCR<Dots /></>
      case 'done':      return t('upload.done')
      case 'error':     return t('upload.failed')
      default:          return t('upload.pending')
    }
  }

  const [files,    setFiles]    = useState([])
  const [dragging, setDragging] = useState(false)
  const [busy,     setBusy]     = useState(false)
  const [allDone,  setAllDone]  = useState(false)

  // fileStates: array of { name, status, progress, message, routes_parsed }
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

  const hasFiles = files.length > 0
  const doneCount  = fileStates.filter(s => s.status === 'done').length
  const errorCount = fileStates.filter(s => s.status === 'error').length

  return (
    <div style={S.root}>
      <div style={S.header}>
        <span style={S.eyebrow}>{t('upload.eyebrow')}</span>
        <h1 style={S.title}>{t('upload.title')}</h1>
        <div style={S.rule} />
      </div>

      <div style={S.card}>
        {/* Drop zone */}
        <div
          style={S.dropzone(dragging || hasFiles)}
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
          <span style={S.dropIcon}>{hasFiles ? '📄' : '⛰'}</span>
          {hasFiles ? (
            <>
              <p style={S.dropText}>
                {t('upload.fileSelected', { count: files.length })}
                {!busy && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{t('upload.clickToChange')}</span>}
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

        {/* Submit */}
        <button
          style={{ ...S.btn, ...(busy || !hasFiles ? S.btnDisabled : {}) }}
          disabled={busy || !hasFiles}
          onClick={submit}
          onMouseEnter={e => { if (!busy && hasFiles) e.target.style.background = 'var(--hold-lt)' }}
          onMouseLeave={e => { if (!busy && hasFiles) e.target.style.background = 'var(--hold)' }}
        >
          {busy
            ? t('upload.processing', { done: fileStates.filter(s => s.status === 'done' || s.status === 'error').length, total: files.length })
            : files.length > 1 ? t('upload.uploadParseFiles', { count: files.length }) : t('upload.uploadParse')}
        </button>

        {/* Per-file progress */}
        {fileStates.some(s => s.status !== 'pending') && (
          <div style={S.progressList}>
            {fileStates.map((fs, i) => (
              <div key={i} style={S.progressItem}>
                <div style={S.progressHeader}>
                  <span style={S.progressName}>{fs.name}</span>
                  <span style={S.progressStatus(fs.status)}>
                    {statusLabel(fs.status)}
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

        {/* Final summary */}
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
              {t('upload.goToList')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    padding: '3rem 2rem',
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
    fontSize: '3rem',
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
  dropzone: base => ({
    border: `2px dashed ${base ? 'var(--hold)' : 'var(--line)'}`,
    background: base ? 'rgba(200,80,42,0.07)' : 'var(--rock)',
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
  fileName: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--hold-lt)',
    letterSpacing: '0.05em',
    marginTop: '0.5rem',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginBottom: '1.75rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--rock)',
    border: '1px solid var(--line)',
    color: 'var(--chalk)',
    fontFamily: 'Barlow, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    padding: '0.65rem 0.85rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
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
  // Progress / status
  progressWrap: {
    marginTop: '1.5rem',
    border: '1px solid var(--line)',
    padding: '1.25rem',
  },
  progressLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: '0.6rem',
  },
  progressBarOuter: {
    background: 'var(--line)',
    height: '3px',
    width: '100%',
    overflow: 'hidden',
  },
  progressBarInner: pct => ({
    height: '100%',
    width: `${pct}%`,
    background: 'var(--hold)',
    transition: 'width 0.3s ease',
  }),
  statusText: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    color: 'var(--chalk)',
    marginTop: '0.75rem',
  },
  // Success panel
  success: {
    marginTop: '1.5rem',
    borderLeft: '4px solid #5a9e6f',
    background: 'rgba(90,158,111,0.08)',
    padding: '1rem 1.25rem',
  },
  successTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#7fc99a',
    textTransform: 'uppercase',
    margin: '0 0 0.3rem',
  },
  successBody: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.9rem',
    color: 'var(--chalk)',
    margin: 0,
  },
  successLink: {
    display: 'inline-block',
    marginTop: '0.75rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--hold-lt)',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  error: {
    marginTop: '1rem',
    borderLeft: '2px solid var(--hold)',
    padding: '0.5rem 0.75rem',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    color: 'var(--hold-lt)',
  },
}

// Animated dots for the "OCR running" state
function Dots() {
  return <span style={{ display: 'inline-block', width: '1.5rem', textAlign: 'left' }}>
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
}

export default function Upload() {
  const navigate  = useNavigate()
  const inputRef  = useRef()

  const [files, setFiles]         = useState([])
  const [busy, setBusy]           = useState(false)
  const [title, setTitle]       = useState('')
  const [dragging, setDragging] = useState(false)

  // upload states: idle | uploading | ocr | done | error
  const [phase, setPhase]       = useState('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult]     = useState(null)   // { topo_id, routes_parsed }
  const [error, setError]       = useState('')

const pickFiles = (selectedFiles) => {
  const pdfs = selectedFiles.filter(
    file => file.type === "application/pdf"
  );

  setFiles(pdfs);
};

  const onDrop = e => {
    e.preventDefault(); setDragging(false)
    pickFiles(Array.from(e.dataTransfer.files))
  }

  const submit = async () => {
  if (files.length === 0 || busy) return;

  setBusy(true);
  setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Remove ".pdf" extension
      const title = file.name.replace(/\.pdf$/i, "");

      const formData = new FormData();

      formData.append("pdf", file);
      formData.append("title", title);

      setPhase("uploading");
      setProgress(0);

	try {
	  await api.post(
			"/topos/upload",
			formData,
		  );
	  } catch (err) {
		console.error(err);

		setError(
		  err.response?.data?.error ||
		  err.message ||
		  "Upload failed"
		);

		setPhase("skip");
	  }

      setPhase("ocr");
    }

    setPhase("done");


  setBusy(false);
};

  return (
    <div style={S.root}>
      <div style={S.header}>
        <span style={S.eyebrow}>Library</span>
        <h1 style={S.title}>Upload Topo</h1>
        <div style={S.rule} />
      </div>

      <div style={S.card}>
        {/* Drop zone */}
        <div
          style={S.dropzone(dragging || files.length > 0)}
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
          <span style={S.dropIcon}>{files ? '📄' : '⛰'}</span>
          {files ? (
            <>
  <p style={S.dropText}>
    {files.length} file{files.length > 1 ? "s" : ""} selected
  </p>

  <div style={{ marginTop: "0.5rem" }}>
    {files.map((f, i) => (
      <p key={i} style={S.fileName}>
        {f.name}
      </p>
    ))}
  </div>
</>
          ) : (
            <>
              <p style={S.dropText}>Drop PDF here or click to browse</p>
              <p style={S.dropSub}>Climbing topo in PDF format</p>
            </>
          )}
        </div>

        {/* Fields */}
        <div style={S.fields}>
          <div style={S.field}>
            <label style={S.label}>Title</label>
            <input
              style={S.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Gorges du Verdon — Secteur Escalès"
              disabled={busy}
              onFocus={e => e.target.style.borderColor = 'var(--hold)'}
              onBlur={e  => e.target.style.borderColor = 'var(--line)'}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          style={{ ...S.btn, ...(busy ? S.btnDisabled : {}) }}
          disabled={busy}
          onClick={submit}
          onMouseEnter={e => { if (!busy) e.target.style.background = 'var(--hold-lt)' }}
          onMouseLeave={e => { if (!busy) e.target.style.background = 'var(--hold)' }}
        >
          {busy ? 'Processing…' : 'Upload & Parse'}
        </button>

        {/* Progress */}
        {(phase === 'uploading' || phase === 'ocr') && (
          <div style={S.progressWrap}>
            <p style={S.progressLabel}>
              {phase === 'uploading' ? 'Uploading' : 'Running OCR & parsing routes'}
            </p>
            <div style={S.progressBarOuter}>
              <div style={S.progressBarInner(phase === 'ocr' ? 100 : progress)} />
            </div>
            <p style={S.statusText}>
              {phase === 'uploading'
                ? `${progress}% transferred`
                : <>Extracting text and detecting routes<Dots /></>
              }
            </p>
          </div>
        )}

        {/* Success */}
        {phase === 'done' && result && (
          <div style={S.success}>
            <p style={S.successTitle}>✓ Topo uploaded</p>
            <p style={S.successBody}>
              {result.routes_parsed > 0
                ? `${result.routes_parsed} route${result.routes_parsed !== 1 ? 's' : ''} parsed from the PDF.`
                : 'No routes were automatically detected — you can add them manually.'}
            </p>
            <button style={S.successLink} onClick={() => navigate('/topos')}>
              Go to topo list →
            </button>
          </div>
        )}

        {/* Error */}
        {error && <p style={S.error}>{error}</p>}
      </div>
    </div>
  )
}

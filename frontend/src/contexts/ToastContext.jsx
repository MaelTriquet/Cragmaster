import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const CONTAINER = {
  position: 'fixed',
  bottom: '1.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 99999,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  alignItems: 'center',
  pointerEvents: 'none',
}

const TOAST_STYLE = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.85rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '0.6rem 1.4rem',
  background: 'var(--rock)',
  border: '1px solid var(--hold)',
  color: 'var(--chalk)',
  whiteSpace: 'nowrap',
  pointerEvents: 'auto',
  animation: 'toastIn 0.2s ease-out',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={CONTAINER}>
        {toasts.map(t => (
          <div key={t.id} style={TOAST_STYLE}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

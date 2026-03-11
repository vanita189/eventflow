import { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert } from '@mui/material'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.map((t, i) => (
        <Snackbar
          key={t.id}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ bottom: `${24 + i * 70}px !important` }}
        >
          <Alert severity={t.type} variant="filled" sx={{ minWidth: 280 }}>
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

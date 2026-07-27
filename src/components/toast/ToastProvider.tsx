'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Toast, type ToastData } from './Toast'

const ToastContext = createContext<(toast: ToastData) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((next: ToastData) => {
    if (timer.current) clearTimeout(timer.current)
    setToast(next)
    timer.current = setTimeout(() => setToast(null), 5000)
  }, [])

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <Toast toast={toast} />}
    </ToastContext.Provider>
  )
}

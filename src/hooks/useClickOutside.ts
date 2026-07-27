'use client'

import { useEffect, type RefObject } from 'react'

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  active = true,
) {
  useEffect(() => {
    if (!active) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onOutside()
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, onOutside, active])
}

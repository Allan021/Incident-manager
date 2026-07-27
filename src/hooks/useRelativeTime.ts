'use client'

import { useSyncExternalStore } from 'react'
import { ago } from '@/lib/time'

const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | null = null

function subscribe(onTick: () => void) {
  listeners.add(onTick)
  timer ??= setInterval(() => listeners.forEach((l) => l()), 30_000)
  return () => {
    listeners.delete(onTick)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

export function useRelativeTime(iso: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => ago(iso),
    () => null,
  )
}

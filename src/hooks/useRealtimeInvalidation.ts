'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeInvalidation(debounceMs = 400): boolean {
  const router = useRouter()
  const [lost, setLost] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wasLost = useRef(false)

  const refresh = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => router.refresh(), debounceMs)
  }, [router, debounceMs])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('dashboard-incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, refresh)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incident_updates' },
        refresh,
      )
      .subscribe((status: string) => {
        const ok = status === 'SUBSCRIBED'
        setLost(!ok)
        if (ok && wasLost.current) router.refresh()
        wasLost.current = !ok
      })

    return () => {
      if (timer.current) clearTimeout(timer.current)
      supabase.removeChannel(channel)
    }
  }, [refresh, router])

  return lost
}

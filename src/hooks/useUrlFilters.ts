'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export function useUrlFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  const tab: 'active' | 'resolved' = params.get('tab') === 'resolved' ? 'resolved' : 'active'
  const sev = params.get('sev')?.split(',').filter(Boolean) ?? []
  const status = params.get('status')?.split(',').filter(Boolean) ?? []

  const push = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString()
      startTransition(() => router.push(qs ? `/dashboard?${qs}` : '/dashboard', { scroll: false }))
    },
    [router],
  )

  const setTab = useCallback(
    (value: 'active' | 'resolved') => {
      const next = new URLSearchParams(params)
      if (value === 'active') next.delete('tab')
      else next.set('tab', value)
      push(next)
    },
    [params, push],
  )

  const toggle = useCallback(
    (key: 'sev' | 'status', value: string) => {
      const current = params.get(key)?.split(',').filter(Boolean) ?? []
      const arr = current.includes(value) ? current.filter((x) => x !== value) : [...current, value]
      const next = new URLSearchParams(params)
      if (arr.length) next.set(key, arr.join(','))
      else next.delete(key)
      push(next)
    },
    [params, push],
  )

  const clear = useCallback(() => {
    const next = new URLSearchParams(params)
    next.delete('sev')
    next.delete('status')
    push(next)
  }, [params, push])

  return { tab, sev, status, pending, setTab, toggle, clear }
}

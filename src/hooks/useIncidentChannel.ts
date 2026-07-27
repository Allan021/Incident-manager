'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { IncidentUpdate } from '@/lib/types'

export function useIncidentChannel(
  incidentId: string,
  initial: IncidentUpdate[],
  currentUser: { id: string; name: string },
): IncidentUpdate[] {
  const [live, setLive] = useState<IncidentUpdate[]>([])
  const names = useRef(new Map<string, string>())

  useEffect(() => {
    const ids = new Set(initial.map((u) => u.id))
    setLive((l) => (l.some((u) => ids.has(u.id)) ? l.filter((u) => !ids.has(u.id)) : l))
  }, [initial])

  useEffect(() => {
    const supabase = createClient()

    const resolveName = async (id: string | null) => {
      if (!id) return 'Unknown'
      if (id === currentUser.id) return currentUser.name
      const cached = names.current.get(id)
      if (cached) return cached
      const { data } = await supabase.from('profiles').select('name').eq('id', id).maybeSingle()
      const name = (data?.name as string | undefined) ?? 'Unknown'
      names.current.set(id, name)
      return name
    }

    const channel = supabase
      .channel(`incident:${incidentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incident_updates',
          filter: `incident_id=eq.${incidentId}`,
        },
        async (payload: { new: IncidentUpdate }) => {
          const row = payload.new
          const author_name = await resolveName(row.author_id)
          setLive((l) => (l.some((u) => u.id === row.id) ? l : [{ ...row, author_name }, ...l]))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [incidentId, currentUser.id, currentUser.name])

  return live
}

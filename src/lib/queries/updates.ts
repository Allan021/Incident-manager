import { createClient } from '@/lib/supabase/server'
import type { IncidentUpdate } from '@/lib/types'

export async function getUpdates(incidentId: string): Promise<IncidentUpdate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('incident_updates')
    .select('id, incident_id, author_id, message, created_at, author:profiles(name)')
    .eq('incident_id', incidentId)
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)

  return (
    data as unknown as (Omit<IncidentUpdate, 'author_name'> & {
      author: { name: string } | { name: string }[] | null
    })[]
  ).map(({ author, ...u }) => ({
    ...u,
    author_name: (Array.isArray(author) ? author[0]?.name : author?.name) ?? 'Unknown',
  }))
}

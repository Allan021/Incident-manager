import { createClient } from '@/lib/supabase/server'
import { SEV_ORDER, type Severity, type Status } from '@/lib/domain'
import type { Incident } from '@/lib/types'

const INCIDENT_SELECT =
  'id, title, description, severity, status, owner_id, created_at, updated_at, resolved_at, owner:profiles!incidents_owner_id_fkey(id, name), incident_updates(count)'

type Row = Omit<Incident, 'owner' | 'update_count'> & {
  owner: { id: string; name: string } | { id: string; name: string }[] | null
  incident_updates: { count: number }[]
}

function toIncident(row: Row): Incident {
  const owner = Array.isArray(row.owner) ? (row.owner[0] ?? null) : row.owner
  const { incident_updates, ...rest } = row
  return { ...rest, owner, update_count: incident_updates?.[0]?.count ?? 0 }
}

export type IncidentFilters = {
  tab: 'active' | 'resolved'
  severity: Severity[]
  status: Status[]
}

export async function getIncidents(filters: IncidentFilters): Promise<Incident[]> {
  const supabase = await createClient()

  let q = supabase.from('incidents').select(INCIDENT_SELECT)
  q = filters.tab === 'resolved' ? q.eq('status', 'resolved') : q.neq('status', 'resolved')
  if (filters.severity.length) q = q.in('severity', filters.severity)
  if (filters.status.length) q = q.in('status', filters.status)

  const { data, error } = await q.order('updated_at', { ascending: false }).limit(200)
  if (error) throw new Error(error.message)

  return (data as unknown as Row[])
    .map(toIncident)
    .sort(
      (a, b) =>
        SEV_ORDER[a.severity] - SEV_ORDER[b.severity] ||
        +new Date(b.updated_at) - +new Date(a.updated_at),
    )
}

export async function getIncident(id: string): Promise<Incident | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('incidents')
    .select(INCIDENT_SELECT)
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toIncident(data as unknown as Row) : null
}

export async function getCounts(tab: 'active' | 'resolved'): Promise<{
  bySeverity: Record<string, number>
  byStatus: Record<string, number>
  active: number
  resolved: number
}> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('incidents').select('severity, status')
  if (error) throw new Error(error.message)

  const bySeverity: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  let active = 0
  let resolved = 0
  for (const r of data as { severity: string; status: string }[]) {
    const isResolved = r.status === 'resolved'
    if (isResolved) resolved++
    else active++
    if (isResolved === (tab === 'resolved')) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1
      bySeverity[r.severity] = (bySeverity[r.severity] ?? 0) + 1
    }
  }
  return { bySeverity, byStatus, active, resolved }
}

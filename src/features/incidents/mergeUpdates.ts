import type { IncidentUpdate } from '@/lib/types'

export function mergeUpdates(
  live: IncidentUpdate[],
  initial: IncidentUpdate[],
): IncidentUpdate[] {
  const byId = new Map<string, IncidentUpdate>()
  for (const u of [...live, ...initial]) byId.set(u.id, u)
  return [...byId.values()].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
}

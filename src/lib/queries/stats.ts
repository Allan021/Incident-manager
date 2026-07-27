import { createClient } from '@/lib/supabase/server'
import type { Stats } from '@/lib/types'

export async function getStats(): Promise<Stats> {
  const delay = Number(process.env.SLOW_STATS_MS ?? 0)
  if (delay > 0) await new Promise((r) => setTimeout(r, delay))

  const supabase = await createClient()
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString()

  const [openRes, resolvedRes] = await Promise.all([
    supabase.from('incidents').select('severity').neq('status', 'resolved'),
    supabase
      .from('incidents')
      .select('created_at, resolved_at')
      .eq('status', 'resolved')
      .gte('resolved_at', weekAgo),
  ])
  if (openRes.error) throw new Error(openRes.error.message)
  if (resolvedRes.error) throw new Error(resolvedRes.error.message)

  const open = openRes.data.length
  const criticals = openRes.data.filter((r) => r.severity === 'critical').length
  const closed = resolvedRes.data.filter((r) => r.resolved_at)
  const mttrMinutes = closed.length
    ? Math.round(
        closed.reduce((a, r) => a + (+new Date(r.resolved_at!) - +new Date(r.created_at)), 0) /
          closed.length /
          60000,
      )
    : null

  return { open, criticals, resolvedLastWeek: closed.length, mttrMinutes }
}

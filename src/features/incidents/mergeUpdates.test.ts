import { mergeUpdates } from './mergeUpdates'
import type { IncidentUpdate } from '@/lib/types'

const u = (id: string, minsAgo: number, message = 'm'): IncidentUpdate => ({
  id,
  incident_id: 'INC-1',
  author_id: 'a',
  author_name: 'A',
  message,
  created_at: new Date(Date.now() - minsAgo * 60000).toISOString(),
})

describe('mergeUpdates', () => {
  it('deduplicates by id — the optimistic row, the realtime echo and the server refresh collapse into one', () => {
    const row = u('same', 1)
    expect(mergeUpdates([row], [u('same', 1), u('other', 2)])).toHaveLength(2)
  })

  it('the server snapshot wins on id collision', () => {
    const fromLive = u('x', 1, 'live copy')
    const fromServer = u('x', 1, 'server copy')
    const merged = mergeUpdates([fromLive], [fromServer])
    expect(merged[0].message).toBe('server copy')
  })

  it('sorts newest first regardless of source', () => {
    const merged = mergeUpdates([u('b', 5)], [u('c', 60), u('a', 1)])
    expect(merged.map((x) => x.id)).toEqual(['a', 'b', 'c'])
  })

  it('handles empty inputs', () => {
    expect(mergeUpdates([], [])).toEqual([])
    expect(mergeUpdates([], [u('a', 1)])).toHaveLength(1)
  })
})

'use client'

import { useCallback, useMemo, useOptimistic } from 'react'
import { useToast } from '@/components/toast'
import { useIncidentChannel } from '@/hooks/useIncidentChannel'
import type { IncidentUpdate } from '@/lib/types'
import { postUpdate } from '../actions'
import { UpdateComposer } from './UpdateComposer'
import { UpdateItem, type FeedItem } from './UpdateItem'

export function ActivityFeed({
  incidentId,
  initial,
  currentUserId,
  currentUserName,
}: {
  incidentId: string
  initial: IncidentUpdate[]
  currentUserId: string
  currentUserName: string
}) {
  const toast = useToast()
  const live = useIncidentChannel(incidentId, initial, {
    id: currentUserId,
    name: currentUserName,
  })

  const items = useMemo<FeedItem[]>(() => {
    const byId = new Map<string, FeedItem>()
    for (const u of [...live, ...initial]) byId.set(u.id, u)
    return [...byId.values()].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  }, [live, initial])

  const [optimistic, addOptimistic] = useOptimistic(items, (state, item: FeedItem) => [
    item,
    ...state,
  ])

  const publish = useCallback(
    async (message: string) => {
      addOptimistic({
        id: `optimistic-${crypto.randomUUID()}`,
        incident_id: incidentId,
        author_id: currentUserId,
        author_name: currentUserName,
        message,
        created_at: new Date().toISOString(),
        pending: true,
      })
      const formData = new FormData()
      formData.set('message', message)
      const result = await postUpdate(incidentId, formData)
      toast(
        result.ok
          ? { type: 'ok', msg: 'Update posted' }
          : { type: 'err', msg: result.error ?? 'Something went wrong' },
      )
      return result.ok
    },
    [addOptimistic, incidentId, currentUserId, currentUserName, toast],
  )

  return (
    <>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          margin: '0 0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        Activity
        <span
          style={{
            fontSize: 11.5,
            color: 'var(--text-muted)',
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 5,
            padding: '2px 7px',
            fontFamily: "'IBM Plex Mono',monospace",
            fontWeight: 400,
          }}
        >
          live
        </span>
      </h2>

      <section
        aria-label="Activity feed"
        aria-live="polite"
        aria-relevant="additions"
        style={{ marginBottom: 28 }}
      >
        {optimistic.length === 0 ? (
          <p
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 28,
              textAlign: 'center',
              fontSize: 13.5,
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            No activity yet — be the first to post an update.
          </p>
        ) : (
          <ol
            role="list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {optimistic.map((e) => (
              <li key={e.id}>
                <UpdateItem update={e} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <UpdateComposer onPublish={publish} />
    </>
  )
}

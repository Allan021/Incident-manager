import { memo } from 'react'
import { Avatar } from '@/components/ui'
import { RelativeTime } from '@/components/RelativeTime'
import type { IncidentUpdate } from '@/lib/types'

export type FeedItem = IncidentUpdate & { pending?: boolean }

export const UpdateItem = memo(function UpdateItem({ update }: { update: FeedItem }) {
  return (
    <article
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 10px',
        borderRadius: 8,
        opacity: update.pending ? 0.55 : 1,
        transition: 'opacity .3s ease',
      }}
    >
      <Avatar name={update.author_name} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 3,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            {update.author_name}
          </span>
          <RelativeTime iso={update.created_at} style={{ fontSize: 11.5, color: 'var(--text-muted)' }} />
          {update.pending && (
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                background: 'var(--bg)',
                border: '1px solid var(--border-strong)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              Sending…
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.55,
            color: 'var(--text-secondary)',
            textWrap: 'pretty',
            margin: 0,
          }}
        >
          {update.message}
        </p>
      </div>
    </article>
  )
})

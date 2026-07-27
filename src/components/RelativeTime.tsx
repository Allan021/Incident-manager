'use client'

import { useRelativeTime } from '@/hooks/useRelativeTime'
import { absoluteUtc, utcShort } from '@/lib/time'

export function RelativeTime({ iso, style }: { iso: string; style?: React.CSSProperties }) {
  const rel = useRelativeTime(iso)

  return (
    <time
      dateTime={iso}
      title={absoluteUtc(iso)}
      style={{ fontFamily: "'IBM Plex Mono',monospace", whiteSpace: 'nowrap', ...style }}
    >
      {rel ?? utcShort(iso)}
    </time>
  )
}

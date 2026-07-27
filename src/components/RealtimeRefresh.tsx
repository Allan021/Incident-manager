'use client'

import { useRealtimeInvalidation } from '@/hooks/useRealtimeInvalidation'
import { ConnectionLostBanner } from './ConnectionLostBanner'

export function RealtimeRefresh() {
  const lost = useRealtimeInvalidation()
  return lost ? <ConnectionLostBanner /> : null
}

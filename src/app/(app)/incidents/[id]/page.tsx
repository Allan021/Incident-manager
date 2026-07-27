import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RealtimeRefresh } from '@/components/RealtimeRefresh'
import { RelativeTime } from '@/components/RelativeTime'
import { Avatar, Badge } from '@/components/ui'
import {
  FeedError,
  FeedSection,
  FeedSkeleton,
  Impact,
  IncidentControls,
} from '@/features/incidents'
import { SEV, ST } from '@/lib/domain'
import { getIncident } from '@/lib/queries'
import { getUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params
  const incident = await getIncident(id)
  return { title: incident ? `${incident.id} — ${incident.title}` : 'Incident not found' }
}

export default async function IncidentPage({ params }: { params: Params }) {
  const { id } = await params

  const [incident, user] = await Promise.all([getIncident(id), getUser()])
  if (!incident) notFound()

  const owner = incident.owner?.name ?? 'Unassigned'

  return (
    <>
      <RealtimeRefresh />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          padding: '24px 24px 80px',
          boxSizing: 'border-box',
        }}
      >
        <Link
          href="/dashboard"
          style={{ fontSize: 13, fontWeight: 600, display: 'inline-block', marginBottom: 18 }}
        >
          ← Back to dashboard
        </Link>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 12.5,
              color: 'var(--text-muted)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '3px 8px',
              borderRadius: 5,
            }}
          >
            {incident.id}
          </span>
          <Badge meta={SEV[incident.severity]} size="md" />
          <Badge meta={ST[incident.status]} size="md" />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3, textWrap: 'pretty' }}>
          {incident.title}
        </h1>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 18,
            marginBottom: 16,
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Avatar name={owner} size={24} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{owner}</span>
            <span>· owner</span>
          </div>
          <span>
            Created <RelativeTime iso={incident.created_at} />
          </span>
          <span>
            Updated <RelativeTime iso={incident.updated_at} />
          </span>
        </div>

        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: '0 0 22px',
            maxWidth: 660,
            textWrap: 'pretty',
          }}
        >
          {incident.description}
        </p>

        <Impact incident={incident} />

        <IncidentControls
          incidentId={incident.id}
          status={incident.status}
          severity={incident.severity}
        />

        <ErrorBoundary fallback={<FeedError />}>
          <Suspense fallback={<FeedSkeleton />}>
            <FeedSection incidentId={incident.id} userId={user!.id} userEmail={user!.email!} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  )
}

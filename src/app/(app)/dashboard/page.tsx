import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RealtimeRefresh } from '@/components/RealtimeRefresh'
import {
  EmptyState,
  Filters,
  Health,
  IncidentRow,
  Stats,
  StatsError,
  StatsSkeleton,
  UrgentBanner,
} from '@/features/dashboard'
import { isSeverity, isStatus } from '@/lib/domain'
import { getCounts, getIncidents } from '@/lib/queries'

export const metadata = { title: 'Incidents — Opswatch' }

export const dynamic = 'force-dynamic'

type SP = Promise<Record<string, string | string[] | undefined>>

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v.join(',') : (v ?? '')).split(',').filter(Boolean)

export default async function DashboardPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams
  const tab = sp.tab === 'resolved' ? 'resolved' : 'active'
  const severity = list(sp.sev).filter(isSeverity)
  const status = list(sp.status).filter(isStatus)

  const [incidents, counts, criticals] = await Promise.all([
    getIncidents({ tab, severity, status }),
    getCounts(tab),
    getIncidents({ tab: 'active', severity: ['critical'], status: [] }),
  ])

  const total = tab === 'resolved' ? counts.resolved : counts.active
  const hasFilters = severity.length + status.length > 0

  return (
    <>
      <RealtimeRefresh />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1160,
          margin: '0 auto',
          padding: '20px 24px 60px',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px' }}>Incidents</h1>

        <UrgentBanner criticals={criticals} />

        <dl
          aria-label="Statistics"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))',
            gap: 10,
            margin: '0 0 14px',
          }}
        >
          <ErrorBoundary fallback={<StatsError />}>
            <Suspense fallback={<StatsSkeleton />}>
              <Stats />
            </Suspense>
          </ErrorBoundary>
        </dl>

        <Health hot={criticals.length > 0} />

        <Filters counts={counts} shown={incidents.length} total={total} />

        {incidents.length === 0 ? (
          <EmptyState hasFilters={hasFilters} tab={tab} />
        ) : (
          <ul
            aria-label="Incident list"
            role="list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {incidents.map((i) => (
              <li key={i.id}>
                <IncidentRow incident={i} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}

import { Nav } from '@/components/nav'
import { Badge } from '@/components/ui'
import { SEV, SEVERITIES, ST, STATUSES, type Meta } from '@/lib/domain'

export const metadata = { title: 'Status guide — Opswatch' }

export const dynamic = 'force-static'
export const revalidate = 3600

function GuideRow({ meta, minWidth }: { meta: Meta; minWidth: number }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <dt>
        <Badge meta={meta} size="md" minWidth={minWidth} />
      </dt>
      <dd
        style={{
          margin: 0,
          fontSize: 13.5,
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          flex: 1,
          minWidth: 240,
          textWrap: 'pretty',
        }}
      >
        {meta.desc}
      </dd>
    </div>
  )
}

export default function StatusGuidePage() {
  return (
    <>
      <Nav user={null} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 760,
          margin: '0 auto',
          padding: '36px 24px 80px',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Status guide</h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 0 32px',
            maxWidth: 560,
            textWrap: 'pretty',
          }}
        >
          How Opswatch classifies incidents. This page is public — no sign-in required — so anyone
          can understand what a badge means.
        </p>

        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Severity</h2>
        <dl style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '0 0 36px' }}>
          {SEVERITIES.map((k) => (
            <GuideRow key={k} meta={SEV[k]} minWidth={88} />
          ))}
        </dl>

        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Status</h2>
        <dl style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
          {STATUSES.map((k) => (
            <GuideRow key={k} meta={ST[k]} minWidth={104} />
          ))}
        </dl>
      </main>
    </>
  )
}

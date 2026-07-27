'use client'

import { useCallback, useOptimistic, useState, useTransition } from 'react'
import { useToast } from '@/components/toast'
import { SEV, SEVERITIES, ST, STATUSES, type Severity, type Status } from '@/lib/domain'
import { updateIncidentField } from '../actions'

const selectStyle: React.CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--border-strong)',
  borderRadius: 7,
  color: 'var(--text)',
  font: 'inherit',
  fontSize: 13.5,
  padding: '7px 10px',
  minWidth: 150,
}

export function IncidentControls({
  incidentId,
  status,
  severity,
}: {
  incidentId: string
  status: Status
  severity: Severity
}) {
  const toast = useToast()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useOptimistic(
    { status, severity },
    (state, patch: Partial<{ status: Status; severity: Severity }>) => ({ ...state, ...patch }),
  )

  const change = useCallback(
    (field: 'status' | 'severity', value: string) => {
      setError(null)
      startTransition(async () => {
        setCurrent({ [field]: value } as Partial<{ status: Status; severity: Severity }>)
        const result = await updateIncidentField(incidentId, field, value)
        if (result.ok) toast({ type: 'ok', msg: 'Incident updated' })
        else setError(result.error ?? 'Something went wrong')
      })
    },
    [incidentId, setCurrent, toast],
  )

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: 16,
        marginBottom: 32,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="status" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
          Status
        </label>
        <select
          id="status"
          value={current.status}
          disabled={pending}
          onChange={(e) => change('status', e.target.value)}
          style={selectStyle}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ST[s].label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="severity" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
          Severity
        </label>
        <select
          id="severity"
          value={current.severity}
          disabled={pending}
          onChange={(e) => change('severity', e.target.value)}
          style={selectStyle}
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {SEV[s].label}
            </option>
          ))}
        </select>
      </div>

      {pending && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 12.5,
            color: 'var(--text-muted)',
            paddingBottom: 8,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 12,
              height: 12,
              border: '2px solid var(--border-strong)',
              borderTopColor: 'var(--link)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin .7s linear infinite',
            }}
          />
          Saving…
        </div>
      )}

      {error && (
        <div role="alert" style={{ fontSize: 12.5, color: 'var(--danger-text-soft)', paddingBottom: 8 }}>
          {error}
        </div>
      )}
    </div>
  )
}

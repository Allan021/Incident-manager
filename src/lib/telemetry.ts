import { series } from './random'

export type HealthMetric = {
  key: string
  label: string
  unit: string
  min: number
  max: number
  warn: number
  crit: number
  invert?: boolean
  value: number
  series: number[]
}

const METRIC_DEFS = [
  { key: 'apiErr', label: 'API error rate', unit: '%', min: 0, max: 40, warn: 5, crit: 10, calm: 1.2, hot: 26 },
  { key: 'p99', label: 'API p99 latency', unit: 'ms', min: 0, max: 3000, warn: 800, crit: 1500, calm: 420, hot: 1900 },
  { key: 'checkout', label: 'Checkout success', unit: '%', min: 30, max: 100, warn: 96, crit: 90, invert: true, calm: 98, hot: 44 },
  { key: 'ingest', label: 'Event ingest', unit: 'k/s', min: 0, max: 80, warn: 15, crit: 8, invert: true, calm: 42, hot: 41 },
] as const

export function healthMetrics(bucket: number, hot: boolean): HealthMetric[] {
  return METRIC_DEFS.map((d) => {
    const base = hot ? d.hot : d.calm
    const s = series(`${d.key}:${bucket}`, {
      base,
      jitter: (d.max - d.min) * 0.06,
      min: d.min,
      max: d.max,
    })
    return { ...d, series: s, value: s[s.length - 1] }
  })
}

export function formatMetric(m: HealthMetric): string {
  if (m.unit === 'ms') return String(Math.round(m.value))
  if (m.unit === 'k/s') return m.value.toFixed(0)
  return m.value.toFixed(1)
}

export function metricState(m: HealthMetric): 'critical' | 'degraded' | 'healthy' {
  const crit = m.invert ? m.value < m.crit : m.value > m.crit
  if (crit) return 'critical'
  const warn = m.invert ? m.value < m.warn : m.value > m.warn
  return warn ? 'degraded' : 'healthy'
}

const IMPACT_BASE = { critical: 80, high: 55, medium: 30, low: 12 } as const

export function impactSeries(id: string, severity: keyof typeof IMPACT_BASE, status: string) {
  const base = status === 'resolved' ? 5 : IMPACT_BASE[severity]
  const drift = status === 'monitoring' ? -18 : status === 'resolved' ? -6 : status === 'identified' ? 2 : 12
  return series(`impact:${id}:${status}`, {
    base,
    jitter: base * 0.35,
    min: 1,
    max: 100,
    drift,
  })
}

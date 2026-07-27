import { pts } from './chart'
import { avatarBg, badge, initials, isSeverity, isStatus } from './domain'
import { series } from './random'
import { healthMetrics, impactSeries } from './telemetry'

describe('seeded series', () => {
  const opts = { base: 20, jitter: 8, min: 0, max: 100 }

  it('is deterministic for the same seed', () => {
    expect(series('a', opts)).toEqual(series('a', opts))
    expect(series('a', opts)).not.toEqual(series('b', opts))
  })

  it('stays inside its bounds', () => {
    const s = series('bounded', { base: 95, jitter: 400, min: 0, max: 100, drift: 50 })
    expect(s.every((v) => v >= 0 && v <= 100)).toBe(true)
  })
})

describe('impact series', () => {
  it('is stable per incident and moves on status change', () => {
    expect(impactSeries('INC-1', 'critical', 'investigating')).toEqual(
      impactSeries('INC-1', 'critical', 'investigating'),
    )
    expect(impactSeries('INC-1', 'critical', 'investigating')).not.toEqual(
      impactSeries('INC-1', 'critical', 'monitoring'),
    )
  })
})

describe('health metrics', () => {
  it('is stable inside a bucket and hotter during a critical', () => {
    expect(healthMetrics(42, false)).toEqual(healthMetrics(42, false))
    const calm = healthMetrics(42, false).find((m) => m.key === 'apiErr')!
    const hot = healthMetrics(42, true).find((m) => m.key === 'apiErr')!
    expect(hot.value).toBeGreaterThan(calm.value)
  })
})

describe('chart mapping', () => {
  it('emits one coordinate pair per sample', () => {
    const out = pts([0, 50, 100], 100, 10, 0, 100)
    expect(out.split(' ')).toHaveLength(3)
    expect(out).toMatch(/^0\.0,/)
  })
})

describe('domain guards', () => {
  it('rejects unknown enum values', () => {
    expect(isSeverity('critical')).toBe(true)
    expect(isSeverity('catastrophic')).toBe(false)
    expect(isStatus('monitoring')).toBe(true)
    expect(isStatus('; drop table incidents')).toBe(false)
  })

  it('derives avatar colour and initials deterministically', () => {
    expect(avatarBg('Maya Chen')).toBe(avatarBg('Maya Chen'))
    expect(initials('Maya Chen')).toBe('MC')
    expect(badge('#ff6b63').fg).toBe('#ff6b63')
  })
})

import { absoluteUtc, ago, utcShort } from './time'

const minsAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString()

describe('ago', () => {
  it('covers every magnitude boundary', () => {
    expect(ago(minsAgo(0.5))).toBe('just now')
    expect(ago(minsAgo(5))).toBe('5 min ago')
    expect(ago(minsAgo(59))).toBe('59 min ago')
    expect(ago(minsAgo(60))).toBe('1h ago')
    expect(ago(minsAgo(23 * 60))).toBe('23h ago')
    expect(ago(minsAgo(48 * 60))).toBe('2d ago')
  })
})

describe('deterministic UTC formats', () => {
  const iso = '2026-07-01T12:34:56.000Z'

  it('utcShort is locale- and timezone-independent', () => {
    expect(utcShort(iso)).toBe('2026-07-01 12:34Z')
  })

  it('absoluteUtc includes seconds and the UTC marker', () => {
    expect(absoluteUtc(iso)).toBe('2026-07-01 12:34:56 UTC')
  })
})

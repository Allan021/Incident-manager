function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seededRandom(seed: string): () => number {
  return mulberry32(hash(seed))
}

export function series(
  seed: string,
  opts: { base: number; jitter: number; min: number; max: number; drift?: number; n?: number },
): number[] {
  const { base, jitter, min, max, drift = 0, n = 40 } = opts
  const rand = seededRandom(seed)
  let v = base
  return Array.from({ length: n }, (_, i) => {
    v = v + drift * (i / n) + (rand() - 0.5) * jitter
    v = Math.min(max, Math.max(min, v))
    return v
  })
}

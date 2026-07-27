export function pts(s: number[], w: number, h: number, min: number, max: number, pad = 3): string {
  return s
    .map((v, i) => {
      const x = (i / (s.length - 1)) * w
      const y = pad + (1 - (v - min) / (max - min)) * (h - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export function lastPoint(points: string): [string, string] {
  const [x, y] = points.split(' ').pop()!.split(',')
  return [x, y]
}

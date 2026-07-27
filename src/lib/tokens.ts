export const palette = {
  bg: '#0d1017',
  bgHeader: '#10141d',
  surface: '#151a24',
  surfaceRaised: '#1b2231',
  surfaceHover: '#1a2130',
  surfaceActive: '#1f3050',
  border: '#232c40',
  borderSubtle: '#1e2637',
  borderStrong: '#2a3450',
  borderHover: '#3a4763',
  text: '#e8ecf4',
  textSecondary: '#cdd9f5',
  textMuted: '#93a0b4',
  textSubtle: '#5d687e',
  textFaint: '#4a5468',
  accent: '#3d6cd6',
  accentHover: '#4a7be6',
  onAccent: '#ffffff',
  link: '#7aa5ff',
  linkHover: '#a4c2ff',
  selection: '#2a3a5f',
  critical: '#ff6b63',
  high: '#ffa04d',
  medium: '#eec95b',
  low: '#8fa3bd',
  investigating: '#7aa5ff',
  identified: '#c792ea',
  monitoring: '#58c7c0',
  success: '#5fd39a',
  dangerAction: '#d64a42',
  dangerActionHover: '#e85a52',
  dangerSurface: '#3a2430',
  dangerBorder: '#64344a',
  dangerText: '#ffb3c0',
  dangerTextSoft: '#ffb0aa',
  dangerDot: '#ff6b8a',
  successSurface: '#1c3328',
  successBorder: '#2f5a42',
  successText: '#8ae0b0',
  avatarSelf: '#33436b',
  scrim: 'rgba(0,0,0,.5)',
} as const

export type PaletteToken = keyof typeof palette

export const avatarHues = [
  '#4a5f8f',
  '#6b4a8f',
  '#3f6f6b',
  '#7a5a3f',
  '#5a3f5f',
  '#33436b',
] as const

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

export const cssVariables = Object.entries(palette)
  .map(([key, value]) => `--${kebab(key)}:${value};`)
  .join('')

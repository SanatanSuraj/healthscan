/** PRD §3 — medical trust palette, WCAG-minded */
export const theme = {
  colors: {
    text: '#0B1220',
    textSecondary: '#475569',
    bg: '#F7F9FC',
    surface: '#FFFFFF',
    primary: '#1E5AA8',
    secondary: '#0F766E',
    border: '#E2E8F0',
    riskGreen: '#16A34A',
    riskYellow: '#CA8A04',
    riskRed: '#DC2626',
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
  },
  type: {
    xs: 12,
    sm: 14,
    body: 16,
    lg: 20,
    xl: 24,
    display: 32,
  },
} as const;

export type Theme = typeof theme;

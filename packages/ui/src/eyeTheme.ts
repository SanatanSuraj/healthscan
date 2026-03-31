/**
 * MobiLab EyeCare — single source of truth for screening UI (iOS / Android / Web).
 * Use these tokens only; avoid magic numbers in screens.
 */
export const eyeTheme = {
  primary: '#005F6B',
  primaryBold: '#004D55',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  warningBg: '#FFF9E6',
  warningBorder: '#E6C266',
  warningText: '#7A4A12',
  mint: '#E6F4F1',
  mintLight: '#E1F2F2',
  metricPillBg: '#F0F5F5',
  disabledBtn: '#CBD5D6',
  textMuted: '#6C8E96',
  textSecondary: '#64748B',
  textDark: '#0F172A',
  border: '#E2E8F0',
  alertBg: '#FFEDED',
  alertBorder: '#E23E3E',
  alertText: '#B91C1C',
  gridBlack: '#000000',
  gridLine: '#FFFFFF',
  gridLineAlt: '#9CA3AF',
  dotRed: '#FF3B30',
  onPrimary: '#FFFFFF',

  /** Layout — same values on all platforms */
  screenPad: 20,
  screenPadBottom: 40,
  introPadH: 24,
  maxCopyWidth: 320,

  hitBack: 40,
  dpadCell: 64,
  dpadGap: 6,
  dpadWidth: 220,
  logoSize: 52,
  logoRadius: 12,
  iconTileSize: 88,
  iconTileRadius: 20,

  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 16,
  radiusFull: 999,
  radiusCheckbox: 4,

  optotypeSize: 120,
} as const;

export type EyeTheme = typeof eyeTheme;

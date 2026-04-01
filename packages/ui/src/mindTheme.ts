/**
 * MindCare / PHQ-9 / mood flows — shared tokens (iOS · Android · Web).
 */
export const mindTheme = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  backLink: '#64748B',

  progressTrack: '#EDE9FE',
  progressFill: '#7C3AED',

  questionCardStart: '#F3E8FF',
  questionCardEnd: '#E9D5FF',

  optionSelectedBorder: '#2563EB',
  speakerBg: '#FB923C',
  speakerIcon: '#1F2937',

  /** Screen backdrop — wellness flow */
  bgTop: '#FFFDF5',
  bgMid: '#FAF5FF',
  bgBottom: '#F8FAFC',

  /** Thank-you / helpline */
  mintTop: '#F0FDF4',
  mintBottom: '#ECFDF5',
  greenDark: '#14532D',
  greenHeading: '#166534',
  greenBody: '#15803D',
  greenMuted: '#22C55E',

  btnPurple: '#7C3AED',
  btnMuted: '#94A3B8',
  btnComplete: '#6366F1',

  /** Mood check-in completion card */
  moodCompleteCard: '#BBF7D0',

  helplinePhone: '#14532D',

  healthPurple: '#F5F3FF',
  healthPurpleText: '#5B21B6',
  healthBlue: '#EFF6FF',
  healthBlueText: '#1D4ED8',
  healthOrange: '#FFF7ED',
  healthOrangeText: '#C2410C',

  /** GAD-7 · Worry & Calm (blue scale) */
  gadPrimary: '#2563EB',
  gadTitle: '#1E40AF',
  gadProgressTrack: '#DBEAFE',
  gadProgressFill: '#2563EB',
  gadQuestionStart: '#D6E4FF',
  gadQuestionEnd: '#FFFFFF',
  gadBlob: 'rgba(37, 99, 235, 0.08)',
  gadBgTop: '#FFF9E5',
  gadBgMid: '#FFFDF5',
  gadBgBottom: '#FFF9FA',
  gadOptionBorder: '#2563EB',

  /** GAD-7 completion */
  gadResultScore: '#F5BC41',
  gadResultBorder: '#FDE68A',
  gadRecBg: '#FEF2F2',
  gadRecTitle: '#991B1B',
  gadRecBody: '#57534E',
  gadSupportRed: '#EE4B44',
  gadXpPurple: '#8A56FF',
  gadHomeBlue: '#5E76F6',

  /** PSS-10 · Stress Check (orange / peach) */
  pssTitle: '#9A3412',
  pssProgressTrack: '#E2E8F0',
  pssProgressFill: '#EA580C',
  pssQuestionStart: '#FFEDD5',
  pssQuestionEnd: '#FFF9F5',
  pssBlob: 'rgba(234, 88, 12, 0.1)',
  pssBgTop: '#FFF8F0',
  pssBgMid: '#FFFBF5',
  pssBgBottom: '#EFFAF4',
  pssOptionBorder: '#2563EB',

  blob: 'rgba(124, 58, 237, 0.07)',

  screenPad: 20,
  screenPadBottom: 36,
  gapMd: 12,
  gapLg: 16,
  radiusSm: 16,
  radiusMd: 20,
  radiusLg: 24,
  radiusPill: 999,

  /** MindCare home dashboard */
  dashboardBgTop: '#FFFBF7',
  dashboardBgMid: '#FFF9F0',
  dashboardBgBottom: '#F8FAFC',
  dashboardHeaderMeta: '#94A3B8',
  dashboardStatDivider: '#E5E7EB',
  streakOrange: '#EA580C',
  dashboardXp: '#8A56FF',
  levelRing: '#14B8A6',
  welcomePink: '#FCE7F3',
  welcomeLavender: '#EDE9FE',
  dashYellowBg: '#FEF9E7',
  dashYellowTitle: '#9A7D0A',
  dashYellowSub: '#9A7D0A',
  dashYellowBadgeBg: '#F5E6A8',
  dashYellowBadgeText: '#78350F',
  dashBlueBg: '#EBF5FB',
  dashBlueTitle: '#21618C',
  dashBlueSub: '#21618C',
  dashBlueBadgeBg: '#D4E6F1',
  dashBlueBadgeText: '#1A5276',
  dashGreenBg: '#E8F8F5',
  dashGreenTitle: '#117864',
  dashGreenSub: '#117864',
  dashGreenBadgeBg: '#ABEBC6',
  dashGreenBadgeText: '#0E6655',
  dashPurpleBg: '#EDE9FE',
  dashPurpleTitle: '#512E5F',
  dashPurpleSub: '#512E5F',
  dashPurpleBadgeBg: '#D7C4F5',
  dashPurpleBadgeText: '#512E5F',
  sosDashBg: '#FDEDEC',
  sosDashBorder: '#CB4335',
  sosDashTitle: '#CB4335',
  sosDashSub: '#E74C3C',
  headerIconBg: '#F1F5F9',

  /** 4-7-8 breathing exercise */
  breathBgTop: '#FFFDF0',
  breathBgMid: '#FFFFFF',
  breathBgBottom: '#F0FDF9',
  breathBlob: 'rgba(148, 163, 184, 0.14)',
  breathMintStart: '#B2F2BB',
  breathMintEnd: '#D3F9D8',
  breathTealStart: '#38C1B3',
  breathTealEnd: '#64D2C1',
  breathRing: '#14B8A6',
  breathRingAlt: '#A855F7',
  breathRingFill: 'rgba(20, 184, 166, 0.18)',
  breathDotMuted: '#CBD5E1',
  breathCompleteText: '#15803D',

  /** Sleep check-in */
  sleepBgTop: '#FFF8F0',
  sleepBgMid: '#FFFBF7',
  sleepBgBottom: '#EFFAF4',
  sleepBlob: 'rgba(251, 191, 36, 0.1)',
  sleepHoursGreen: '#22C55E',
  sleepCardSelectedBg: '#ECFDF5',
  sleepCardSelectedBorder: '#2563EB',
  sleepCardTextMuted: '#6B7280',
  sleepDoneBlue: '#6C7FF2',
  sleepStepperBorder: '#E5E7EB',
} as const;

export type MindTheme = typeof mindTheme;

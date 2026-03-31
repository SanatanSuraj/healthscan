export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Reaction trial validity — flag impossibly fast responses (<120ms). */
export function reactionTrialValid(reactionMs: number): boolean {
  return reactionMs >= 120 && reactionMs < 4000;
}

/** Map mean RT (ms) to 0–100 screening score (higher = better). */
export function reactionScoreFromMeanMs(meanMs: number): number {
  if (meanMs <= 0) return 0;
  let s = 100 - Math.round((meanMs - 180) / 4);
  return clamp(s, 0, 100);
}

/** Generate CPT sequence: true = target */
export function generateCptSequence(length: number, targetProb = 0.25): boolean[] {
  const out: boolean[] = [];
  for (let i = 0; i < length; i++) {
    out.push(Math.random() < targetProb);
  }
  return out;
}

/** PSS-like stress: sum of 0–4 Likert per item → invert to 0–100 wellness */
export function stressScoreFromLikert(
  answers: number[],
  maxPerQuestion = 4,
): number {
  if (answers.length === 0) return 50;
  const total = answers.reduce((a, b) => a + b, 0);
  const max = answers.length * maxPerQuestion;
  const norm = total / max;
  return Math.round((1 - norm) * 100);
}

export const PSS_LIKE_QUESTIONS = [
  'In the last month, how often have you felt stressed?',
  'How often have you felt unable to control important things?',
  'How often have you felt nervous or stressed?',
  'How often have you felt confident handling problems?',
  'How often have you felt things were going your way?',
];

/** Credit-card calibration: approximate pixels per mm from card width input */
export function pixelsPerMm(
  cardWidthPx: number,
  standardMm = 85.6,
): number {
  return cardWidthPx / standardMm;
}

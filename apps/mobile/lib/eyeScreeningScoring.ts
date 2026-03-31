export function visualAcuityMetrics(correct: number, total: number) {
  const t = Math.max(1, total);
  const ratio = Math.min(1, Math.max(0, correct / t));
  const denom = Math.round(200 - ratio * 180);
  const d = Math.max(20, Math.min(200, denom));
  const logMAR = Math.log10(d / 20).toFixed(1);
  return { snellenLabel: `20/${d}`, logMAR };
}

export type RiskTier = 'low' | 'moderate' | 'high';

export function computeRiskTier(input: {
  worstSnellenDenom: number;
  colorWrong: number;
  colorTotal: number;
  amslerTotal: number;
  positiveSymptoms: number;
}): RiskTier {
  const colorSuspected =
    input.colorTotal > 0 &&
    input.colorWrong / input.colorTotal >= 0.4;

  if (
    input.worstSnellenDenom >= 100 ||
    colorSuspected ||
    input.amslerTotal > 0 ||
    input.positiveSymptoms >= 3
  ) {
    return 'high';
  }
  if (
    input.worstSnellenDenom >= 70 ||
    input.positiveSymptoms >= 1
  ) {
    return 'moderate';
  }
  return 'low';
}

export function parseSnellenDenom(label: string): number {
  const m = label.match(/20\/(\d+)/);
  if (!m) return 40;
  return Number(m[1]);
}

/** Near acuity label N* from selected line */
export function nearAcuityLabel(n: string | null): string {
  return n ? n.toUpperCase() : '—';
}

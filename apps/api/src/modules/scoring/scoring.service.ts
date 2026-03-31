import { Injectable } from '@nestjs/common';

/** PRD §5 — screening-only scoring (not clinical). */

export interface MindPayload {
  memory?: { maxSpan: number; roundsCorrect: number };
  attention?: {
    accuracy: number;
    missedTargets: number;
    falseAlarms: number;
  };
  reaction?: { meanMs: number; trials: number };
  stress?: { likertTotal: number; questionCount: number };
}

export interface EyePayload {
  acuity?: { rowsCorrect: number; rowsTotal: number };
  color?: { diagnosis: string };
  astigmatism?: { suspected: boolean };
  contrast?: { level: number; maxLevel: number };
}

@Injectable()
export class ScoringService {
  scoreMind(p: MindPayload): { subtests: Record<string, unknown>[]; composite: number } {
    const subtests: Record<string, unknown>[] = [];
    const scores: number[] = [];

    if (p.memory) {
      const span = p.memory.maxSpan ?? 0;
      const s = Math.min(100, Math.round((span / 7) * 100));
      subtests.push({
        key: 'memory',
        score: s,
        metrics: p.memory,
      });
      scores.push(s);
    }

    if (p.attention) {
      const acc = p.attention.accuracy ?? 0;
      const s = Math.round(Math.max(0, Math.min(100, acc)));
      subtests.push({
        key: 'attention',
        score: s,
        metrics: p.attention,
      });
      scores.push(s);
    }

    if (p.reaction && p.reaction.meanMs > 0) {
      const ms = p.reaction.meanMs;
      let s = 100 - Math.round((ms - 180) / 4);
      s = Math.max(0, Math.min(100, s));
      subtests.push({
        key: 'reaction',
        score: s,
        metrics: p.reaction,
      });
      scores.push(s);
    }

    if (p.stress && p.stress.questionCount > 0) {
      const max = p.stress.questionCount * 4;
      const raw = p.stress.likertTotal;
      const stressNorm = raw / max;
      const s = Math.round((1 - stressNorm) * 100);
      subtests.push({
        key: 'stress',
        score: s,
        metrics: p.stress,
      });
      scores.push(s);
    }

    const composite =
      scores.length === 0
        ? 0
        : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { subtests, composite };
  }

  scoreEye(p: EyePayload): { subtests: Record<string, unknown>[]; composite: number } {
    const subtests: Record<string, unknown>[] = [];
    const scores: number[] = [];

    if (p.acuity && p.acuity.rowsTotal > 0) {
      const s = Math.round(
        (p.acuity.rowsCorrect / p.acuity.rowsTotal) * 100,
      );
      subtests.push({ key: 'acuity', score: s, metrics: p.acuity });
      scores.push(s);
    }

    if (p.color) {
      const d = (p.color.diagnosis ?? 'normal').toLowerCase();
      const s = d === 'normal' ? 95 : 55;
      subtests.push({ key: 'color', score: s, metrics: p.color });
      scores.push(s);
    }

    if (p.astigmatism) {
      const s = p.astigmatism.suspected ? 60 : 90;
      subtests.push({
        key: 'astigmatism',
        score: s,
        metrics: p.astigmatism,
      });
      scores.push(s);
    }

    if (p.contrast && p.contrast.maxLevel > 0) {
      const s = Math.round(
        (p.contrast.level / p.contrast.maxLevel) * 100,
      );
      subtests.push({ key: 'contrast', score: s, metrics: p.contrast });
      scores.push(s);
    }

    const composite =
      scores.length === 0
        ? 0
        : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { subtests, composite };
  }

  unifiedScore(
    mind: number | undefined,
    vision: number | undefined,
    weights: { mind: number; vision: number },
  ): number {
    const m = mind ?? 0;
    const v = vision ?? 0;
    const wm = weights.mind;
    const wv = weights.vision;
    return Math.round(m * wm + v * wv);
  }

  riskBand(
    unified: number,
    flags: { critical?: boolean; moderate?: boolean },
  ): 'green' | 'yellow' | 'red' {
    if (flags.critical || unified < 50) return 'red';
    if (flags.moderate || unified < 70) return 'yellow';
    return 'green';
  }

  detectFlags(payload: {
    mind?: MindPayload;
    eye?: EyePayload;
    memoryScore?: number;
    contrastScore?: number;
  }): { critical: boolean; moderate: boolean } {
    let critical = false;
    let moderate = false;

    if (payload.mind?.memory && (payload.memoryScore ?? 100) < 40) {
      critical = true;
    }
    if (payload.eye?.acuity) {
      const ratio =
        payload.eye.acuity.rowsTotal > 0
          ? payload.eye.acuity.rowsCorrect / payload.eye.acuity.rowsTotal
          : 1;
      if (ratio < 0.35) critical = true;
      else if (ratio < 0.55) moderate = true;
    }
    if (payload.contrastScore != null && payload.contrastScore < 35) {
      critical = true;
    } else if (payload.contrastScore != null && payload.contrastScore < 55) {
      moderate = true;
    }

    return { critical, moderate };
  }
}

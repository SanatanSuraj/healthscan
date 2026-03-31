import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  EyeMetricPill,
  EyeDirectionalPad,
  eyeTextNoSelectWeb,
  type EyeDirection,
} from '@healthscan/ui';
import { useEyeScreeningStore, type EyeSide } from '@/lib/eyeScreeningStore';
import { TRIALS_PER_EYE } from '@/lib/eyeScreeningContent';
import { visualAcuityMetrics } from '@/lib/eyeScreeningScoring';

const ROTATIONS = [0, 90, 180, 270] as const;
const ROT_TO_ANS: Record<
  (typeof ROTATIONS)[number],
  EyeDirection
> = {
  0: 'right',
  90: 'down',
  180: 'left',
  270: 'up',
};

function randomRotation() {
  return ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
}

export default function VisualAcuityScreen() {
  const setVisualAcuity = useEyeScreeningStore((s) => s.setVisualAcuity);

  const [side, setSide] = useState<EyeSide>('od');
  const [trialIdx, setTrialIdx] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [rotation, setRotation] = useState(() => randomRotation());

  const title =
    side === 'od'
      ? 'Visual Acuity — Right Eye (OD)'
      : 'Visual Acuity — Left Eye (OS)';

  const completed = trialIdx - 1;
  const displayMetrics = useMemo(() => {
    if (completed < 1) return { snellenLabel: '20/200', logMAR: '1.0' };
    return visualAcuityMetrics(correct, completed);
  }, [correct, completed]);

  const finishSide = useCallback(
    (finalCorrect: number) => {
      const m = visualAcuityMetrics(finalCorrect, TRIALS_PER_EYE);
      setVisualAcuity(side, {
        correct: finalCorrect,
        total: TRIALS_PER_EYE,
        snellenLabel: m.snellenLabel,
        logMAR: m.logMAR,
      });
      if (side === 'od') {
        setSide('os');
        setTrialIdx(1);
        setCorrect(0);
        setRotation(randomRotation());
      } else {
        router.replace('/screening/near-intro');
      }
    },
    [setVisualAcuity, side],
  );

  const onDir = (dir: EyeDirection) => {
    const right = ROT_TO_ANS[rotation] === dir;
    const nextCorrect = correct + (right ? 1 : 0);
    if (trialIdx === TRIALS_PER_EYE) {
      finishSide(nextCorrect);
      return;
    }
    setCorrect(nextCorrect);
    setTrialIdx((t) => t + 1);
    setRotation(randomRotation());
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader
        title={title}
        progress={`${trialIdx}/${TRIALS_PER_EYE}`}
        onBack={() => router.replace('/screening/patient')}
      />
      <View style={styles.badgeWrap}>
        <EyeMetricPill>
          {`Snellen: ${displayMetrics.snellenLabel} • logMAR: ${displayMetrics.logMAR}`}
        </EyeMetricPill>
      </View>

      <View style={styles.center}>
        <Text
          style={[
            styles.optotype,
            eyeTextNoSelectWeb,
            { transform: [{ rotate: `${rotation}deg` }] },
          ]}
        >
          E
        </Text>
      </View>

      <EyeDirectionalPad
        onDirection={onDir}
        center={<Text style={styles.eyeIco}>👁</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.surface },
  badgeWrap: { alignItems: 'center', paddingBottom: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  optotype: {
    fontSize: eyeTheme.optotypeSize,
    fontWeight: '900',
    color: eyeTheme.primary,
  },
  eyeIco: { fontSize: 26 },
});

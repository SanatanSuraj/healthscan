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
import { CONTRAST_STEPS } from '@/lib/eyeScreeningContent';
import { useEyeScreeningStore } from '@/lib/eyeScreeningStore';

const ROTATIONS = [0, 90, 180, 270] as const;
const ROT_TO_ANS: Record<(typeof ROTATIONS)[number], EyeDirection> = {
  0: 'right',
  90: 'down',
  180: 'left',
  270: 'up',
};

function randomRotation() {
  return ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
}

export default function ContrastTestScreen() {
  const setContrastFinal = useEyeScreeningStore((s) => s.setContrastFinal);
  const [stepIdx, setStepIdx] = useState(1);
  const [rotation, setRotation] = useState(() => randomRotation());

  const idx = Math.min(CONTRAST_STEPS - 1, Math.max(0, stepIdx - 1));
  const percent = Math.round(100 - idx * 10);
  const logCS = (0 - idx * 0.05).toFixed(2);

  const opacity = useMemo(() => 0.18 + (percent / 100) * 0.82, [percent]);

  const finish = useCallback(() => {
    setContrastFinal({
      percent,
      logCS,
      levelIndex: idx,
    });
    router.replace('/screening/amsler-intro');
  }, [idx, logCS, percent, setContrastFinal]);

  const onDir = (_dir: EyeDirection) => {
    if (stepIdx === CONTRAST_STEPS) {
      finish();
      return;
    }
    setStepIdx((s) => s + 1);
    setRotation(randomRotation());
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader
        title="Contrast Sensitivity"
        progress={`${stepIdx}/${CONTRAST_STEPS}`}
        onBack={() => router.replace('/screening/contrast-intro')}
      />
      <View style={styles.badgeWrap}>
        <EyeMetricPill>
          {`Contrast: ${percent}% • logCS: ${logCS}`}
        </EyeMetricPill>
      </View>

      <View style={styles.center}>
        <Text
          style={[
            styles.optotype,
            eyeTextNoSelectWeb,
            { opacity, transform: [{ rotate: `${rotation}deg` }] },
          ]}
        >
          E
        </Text>
      </View>

      <EyeDirectionalPad
        onDirection={onDir}
        center={<Text style={styles.pctTxt}>{`${percent}%`}</Text>}
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
  pctTxt: { fontSize: 13, fontWeight: '800', color: eyeTheme.primary },
});

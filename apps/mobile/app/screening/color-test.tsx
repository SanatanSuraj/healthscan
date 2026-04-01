import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  eyePressableWeb,
} from '@healthscan/ui';
import { COLOR_PLATES } from '@/lib/eyeScreeningContent';
import { useEyeScreeningStore } from '@/lib/eyeScreeningStore';
import { goBackOrReplace } from '@/lib/navigation';

const { width: W } = Dimensions.get('window');
const PLATE_SZ = Math.min(280, W - 48);

export default function ColorVisionTestScreen() {
  const addColorResult = useEyeScreeningStore((s) => s.addColorResult);
  const [plateIdx, setPlateIdx] = useState(0);

  const plate = COLOR_PLATES[plateIdx];
  const progress = `${plateIdx + 1}/${COLOR_PLATES.length}`;

  const dots = useMemo(
    () => makeDots(plate?.correct ?? 0, plateIdx),
    [plate, plateIdx],
  );

  const onPick = (n: number) => {
    addColorResult({
      plateIndex: plateIdx,
      selected: n,
      correctDigit: plate.correct,
    });
    if (plateIdx + 1 >= COLOR_PLATES.length) {
      router.replace('/screening/contrast-intro');
    } else {
      setPlateIdx((i) => i + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader
        title="Color Vision"
        progress={progress}
        onBack={() => goBackOrReplace('/screening/color-intro')}
      />
      <View style={styles.body}>
        <View style={[styles.plate, { width: PLATE_SZ, height: PLATE_SZ }]}>
          {dots.map((d) => (
            <View
              key={d.key}
              style={[
                styles.dot,
                {
                  left: d.x,
                  top: d.y,
                  width: d.s,
                  height: d.s,
                  borderRadius: d.s / 2,
                  backgroundColor: d.c,
                },
              ]}
            />
          ))}
          <View style={styles.plateInner} pointerEvents="none">
            <Text style={styles.hiddenHint} />
          </View>
        </View>
        <Text style={styles.q}>What number do you see?</Text>
        <View style={styles.grid}>
          {plate.options.map((n) => (
            <Pressable
              key={n}
              style={[styles.opt, eyePressableWeb]}
              onPress={() => onPick(n)}
            >
              <Text style={styles.optTxt}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

/** Deterministic pseudo–Ishihara field for consistent plate feel */
function makeDots(correct: number, seed: number) {
  const dots: {
    key: string;
    x: number;
    y: number;
    s: number;
    c: string;
  }[] = [];
  const rng = mulberry32(seed * 9973 + correct * 131 + 17);
  const greens = ['#2E7D32', '#43A047', '#66BB6A', '#1B5E20'];
  const reds = ['#C62828', '#E53935', '#FF7043', '#D84315'];

  for (let i = 0; i < 420; i++) {
    const ang = rng() * Math.PI * 2;
    const rad = Math.sqrt(rng()) * (PLATE_SZ * 0.46);
    const cx = PLATE_SZ / 2 + Math.cos(ang) * rad;
    const cy = PLATE_SZ / 2 + Math.sin(ang) * rad;
    const inDigit =
      digitMask(correct, cx - PLATE_SZ / 2, cy - PLATE_SZ / 2, PLATE_SZ) >
      0.35;
    const palette = inDigit ? greens : reds;
    const c = palette[Math.floor(rng() * palette.length)];
    const s = 3 + rng() * 5;
    dots.push({
      key: `d-${i}`,
      x: cx - s / 2,
      y: cy - s / 2,
      s,
      c,
    });
  }
  return dots;
}

function digitMask(
  digit: number,
  x: number,
  y: number,
  size: number,
): number {
  const nx = x / (size * 0.42);
  const ny = y / (size * 0.5);
  if (digit === 3) {
    const d =
      Math.hypot(nx - 0.1, ny + 0.1) < 0.85 &&
      !(Math.hypot(nx + 0.55, ny - 0.1) < 0.35);
    return d ? 1 : 0;
  }
  if (digit === 8) {
    return Math.hypot(nx, ny * 1.05) < 0.75 ? 1 : 0;
  }
  if (digit === 12) {
    return Math.abs(nx) < 0.9 && Math.abs(ny) < 0.35 ? 1 : 0;
  }
  if (digit === 29) {
    return Math.abs(nx) < 0.55 && Math.abs(ny + 0.1) < 0.65 ? 1 : 0;
  }
  return Math.hypot(nx - 0.15, ny) < 0.7 ? 1 : 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 8,
  },
  plate: {
    borderRadius: PLATE_SZ / 2,
    overflow: 'hidden',
    backgroundColor: '#FBE9E7',
    alignSelf: 'center',
  },
  dot: { position: 'absolute' },
  plateInner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenHint: {},
  q: {
    marginTop: 18,
    fontSize: 16,
    color: eyeTheme.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    maxWidth: 360,
  },
  opt: {
    width: (Math.min(W, 360) - 52) / 2,
    aspectRatio: 1.2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    backgroundColor: eyeTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optTxt: {
    fontSize: 28,
    fontWeight: '800',
    color: eyeTheme.primary,
  },
});

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type GestureResponderEvent,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  EyePrimaryButton,
  eyePressableWeb,
} from '@healthscan/ui';
import { useEyeScreeningStore, type EyeSide } from '@/lib/eyeScreeningStore';

const GRID_N = 20;
const GRID_PX = 300;

export default function AmslerGridScreen() {
  const { eye } = useLocalSearchParams<{ eye: string }>();
  const side: EyeSide = eye === 'os' ? 'os' : 'od';
  const markAmsler = useEyeScreeningStore((s) => s.markAmsler);
  const marked = useEyeScreeningStore((s) => s.amsler[side]);
  const count = marked.length;

  const title =
    side === 'od'
      ? 'Amsler Grid — Right Eye (OD)'
      : 'Amsler Grid — Left Eye (OS)';

  const cell = GRID_PX / GRID_N;

  const onGridPress = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    const c = Math.min(
      GRID_N - 1,
      Math.max(0, Math.floor(locationX / cell)),
    );
    const r = Math.min(
      GRID_N - 1,
      Math.max(0, Math.floor(locationY / cell)),
    );
    markAmsler(side, `${r}-${c}`);
  };

  const linesV = useMemo(
    () => Array.from({ length: GRID_N + 1 }, (_, i) => i),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader
        title={title}
        progress="5/6"
        onBack={() =>
          router.replace(
            side === 'os' ? '/screening/amsler/od' : '/screening/amsler-intro',
          )
        }
      />
      <Text style={styles.hint}>
        Tap areas where lines appear distorted or missing
      </Text>

      <View style={styles.center}>
        <Pressable
          style={[styles.gridWrap, eyePressableWeb, { width: GRID_PX, height: GRID_PX }]}
          onPress={onGridPress}
        >
          <View style={styles.black} />
          {linesV.map((i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.lineV,
                {
                  left: (i * GRID_PX) / GRID_N,
                  height: GRID_PX,
                },
              ]}
            />
          ))}
          {linesV.map((i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.lineH,
                {
                  top: (i * GRID_PX) / GRID_N,
                  width: GRID_PX,
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.markDot,
              {
                left: GRID_PX / 2 - 5,
                top: GRID_PX / 2 - 5,
              },
            ]}
          />
          {marked.map((k) => {
            const [rs, cs] = k.split('-');
            const r = Number(rs);
            const c = Number(cs);
            return (
              <View
                key={k}
                pointerEvents="none"
                style={[
                  styles.markCell,
                  {
                    left: c * cell,
                    top: r * cell,
                    width: cell,
                    height: cell,
                  },
                ]}
              />
            );
          })}
        </Pressable>
        <Text style={styles.counter}>Distortions marked: {count}</Text>
      </View>

      <View style={styles.footer}>
        <EyePrimaryButton
          title={side === 'od' ? 'Next → Left Eye (OS)' : 'Next →'}
          onPress={() => {
            if (side === 'od') router.replace('/screening/amsler/os');
            else router.replace('/screening/symptoms');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  hint: {
    textAlign: 'center',
    color: eyeTheme.textMuted,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: eyeTheme.screenPad,
    marginBottom: 12,
  },
  center: { flex: 1, alignItems: 'center', paddingTop: 8 },
  gridWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: eyeTheme.gridBlack,
  },
  black: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: eyeTheme.gridBlack,
  },
  lineV: {
    position: 'absolute',
    top: 0,
    width: 1,
    backgroundColor: eyeTheme.gridLine,
  },
  lineH: {
    position: 'absolute',
    left: 0,
    height: 1,
    backgroundColor: eyeTheme.gridLine,
  },
  markDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: eyeTheme.dotRed,
    zIndex: 10,
  },
  markCell: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,200,200,0.5)',
  },
  counter: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 10,
    color: eyeTheme.textMuted,
    fontSize: 14,
  },
  footer: { padding: eyeTheme.screenPad, paddingBottom: 28 },
});

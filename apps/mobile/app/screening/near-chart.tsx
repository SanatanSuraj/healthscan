import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  eyePressableWeb,
  eyeTextNoSelectWeb,
} from '@healthscan/ui';
import { NEAR_VISION_LINES } from '@/lib/eyeScreeningContent';
import { useEyeScreeningStore } from '@/lib/eyeScreeningStore';

const SIZES = [28, 24, 20, 17, 15, 13, 11];

export default function NearVisionChartScreen() {
  const setNearVisionN = useEyeScreeningStore((s) => s.setNearVisionN);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader
        title="Near Vision"
        progress="2/6"
        onBack={() => router.replace('/screening/near-intro')}
      />
      <Text style={styles.hint}>
        Tap the smallest line you can read clearly
      </Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {NEAR_VISION_LINES.map((line, i) => (
            <Pressable
              key={line.n}
              style={({ pressed }) => [
                styles.line,
                i > 0 && styles.lineBorder,
                eyePressableWeb,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => {
                setNearVisionN(line.n);
                router.replace('/screening/color-intro');
              }}
            >
              <Text style={[styles.meta, eyeTextNoSelectWeb, { fontSize: SIZES[i] ?? 12 }]}>
                <Text style={styles.nTag}>{line.n}</Text>
                {' — '}
                <Text style={styles.dev}>{line.text}</Text>
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  hint: {
    textAlign: 'center',
    color: eyeTheme.textMuted,
    fontSize: 15,
    paddingHorizontal: eyeTheme.screenPad,
    marginBottom: 12,
    fontWeight: '600',
  },
  scroll: {
    padding: eyeTheme.screenPad,
    paddingBottom: eyeTheme.screenPadBottom,
  },
  card: {
    backgroundColor: eyeTheme.surface,
    borderRadius: eyeTheme.radiusLg,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    paddingVertical: 8,
  },
  line: { paddingVertical: 14, paddingHorizontal: 16 },
  lineBorder: {
    borderTopWidth: 1,
    borderTopColor: eyeTheme.border,
  },
  meta: { color: '#111', textAlign: 'center' },
  nTag: { fontWeight: '700', color: eyeTheme.primary },
  dev: { fontWeight: '500', color: '#111' },
});

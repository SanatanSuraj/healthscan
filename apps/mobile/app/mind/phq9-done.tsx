import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindBackLink,
  MindAudioButton,
  MindHelplineCard,
  MindPurpleButton,
  MindMutedButton,
  mindTextNoSelectWeb,
} from '@healthscan/ui';
import { useMindScreeningStore } from '@/lib/mindScreeningStore';

export default function Phq9DoneScreen() {
  const scores = useMindScreeningStore((s) => s.phq9Scores);
  const clearPhq9 = useMindScreeningStore((s) => s.clearPhq9);

  const total = useMemo(
    () => (scores?.length ? scores.reduce((a, b) => a + b, 0) : null),
    [scores],
  );

  return (
    <MindScreenBackdrop variant="mint" showBlobs={false}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <MindBackLink onPress={() => router.replace('/mind')} />
          <Text style={styles.heart}>💚</Text>
          <Text style={[styles.h, mindTextNoSelectWeb]}>
            Thank you for being honest
          </Text>
          <Text style={styles.sub}>
            Your feelings matter. Support is available right now.
          </Text>
          <View style={styles.audio}>
            <MindAudioButton />
          </View>
          {total != null ? (
            <Text style={styles.scoreLine}>PHQ-9 total (screening): {total}</Text>
          ) : null}
          <MindHelplineCard />
          <MindPurpleButton
            title="All Support Options"
            onPress={() => router.replace('/mind')}
            style={styles.gap}
          />
          <MindMutedButton
            title="Continue Home"
            onPress={() => {
              clearPhq9();
              router.replace('/(tabs)');
            }}
            style={styles.gapSm}
          />
        </ScrollView>
      </SafeAreaView>
    </MindScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
    alignItems: 'center',
  },
  heart: { fontSize: 52, marginTop: 8, textAlign: 'center' },
  h: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '800',
    color: mindTheme.greenHeading,
    textAlign: 'center',
  },
  sub: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: mindTheme.greenBody,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  audio: { marginTop: 20, marginBottom: 8 },
  scoreLine: {
    fontSize: 14,
    fontWeight: '700',
    color: mindTheme.textSecondary,
    marginBottom: 8,
  },
  gap: { width: '100%', marginTop: 8 },
  gapSm: { width: '100%', marginTop: mindTheme.gapMd },
});

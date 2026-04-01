import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindPhq9Header,
  MindQuestionCard,
  MindOptionCard,
} from '@healthscan/ui';
import { PHQ9_ITEMS, PHQ9_LIKERT_OPTIONS } from '@/lib/mindScreeningContent';
import { useMindScreeningStore } from '@/lib/mindScreeningStore';
import { goBackOrReplace } from '@/lib/navigation';

export default function Phq9Screen() {
  const setPhq9Scores = useMindScreeningStore((s) => s.setPhq9Scores);
  const [answers, setAnswers] = useState<number[]>([]);
  const index = answers.length;
  const q = PHQ9_ITEMS[index];
  const total = PHQ9_ITEMS.length;
  const currentStep = index + 1;

  const onBack = useCallback(() => {
    if (index <= 0) goBackOrReplace('/mind/quick-health');
    else setAnswers((a) => a.slice(0, -1));
  }, [index]);

  const selectScore = (score: number) => {
    const next = [...answers, score];
    if (next.length >= total) {
      setPhq9Scores(next);
      router.replace('/mind/phq9-done');
    } else {
      setAnswers(next);
    }
  };

  if (!q) return null;

  return (
    <MindScreenBackdrop>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MindPhq9Header
            onBack={onBack}
            current={currentStep}
            total={total}
          />
          <MindQuestionCard title={q.en} subtitle={q.hi} />
          <View style={styles.opts}>
            {PHQ9_LIKERT_OPTIONS.map((o) => (
              <MindOptionCard
                key={o.label}
                emoji={o.emoji}
                label={o.label}
                onPress={() => selectScore(o.score)}
              />
            ))}
          </View>
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
  },
  opts: { marginTop: 4 },
});

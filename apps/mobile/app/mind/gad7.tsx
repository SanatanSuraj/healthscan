import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindGad7Header,
  MindQuestionCard,
  MindOptionCard,
} from '@healthscan/ui';
import { GAD7_ITEMS, GAD7_LIKERT_OPTIONS } from '@/lib/mindScreeningContent';
import { useMindScreeningStore } from '@/lib/mindScreeningStore';
import { goBackOrReplace } from '@/lib/navigation';

export default function Gad7Screen() {
  const setGad7Scores = useMindScreeningStore((s) => s.setGad7Scores);
  const [answers, setAnswers] = useState<number[]>([]);
  const index = answers.length;
  const q = GAD7_ITEMS[index];
  const total = GAD7_ITEMS.length;
  const currentStep = index + 1;

  const onBack = useCallback(() => {
    if (index <= 0) goBackOrReplace('/mind/quick-health');
    else setAnswers((a) => a.slice(0, -1));
  }, [index]);

  const selectScore = (score: number) => {
    const next = [...answers, score];
    if (next.length >= total) {
      setGad7Scores(next);
      router.replace('/mind/gad7-done');
    } else {
      setAnswers(next);
    }
  };

  if (!q) return null;

  return (
    <MindScreenBackdrop variant="gad7">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MindGad7Header
            onBack={onBack}
            current={currentStep}
            total={total}
          />
          <MindQuestionCard
            title={q.en}
            subtitle={q.hi}
            gradientColors={[mindTheme.gadQuestionStart, mindTheme.gadQuestionEnd]}
          />
          <View style={styles.opts}>
            {GAD7_LIKERT_OPTIONS.map((o) => (
              <MindOptionCard
                key={o.label}
                emoji={o.emoji}
                label={o.label}
                selectionBorderColor={mindTheme.gadOptionBorder}
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

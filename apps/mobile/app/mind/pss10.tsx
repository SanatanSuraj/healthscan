import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindPss10Header,
  MindQuestionCard,
  MindOptionCard,
} from '@healthscan/ui';
import { PSS10_ITEMS, PSS10_LIKERT_OPTIONS } from '@/lib/mindScreeningContent';
import { useMindScreeningStore } from '@/lib/mindScreeningStore';

export default function Pss10Screen() {
  const setPss10RawScores = useMindScreeningStore((s) => s.setPss10RawScores);
  const [answers, setAnswers] = useState<number[]>([]);
  const index = answers.length;
  const q = PSS10_ITEMS[index];
  const total = PSS10_ITEMS.length;
  const currentStep = index + 1;

  const onBack = useCallback(() => {
    if (index <= 0) router.back();
    else setAnswers((a) => a.slice(0, -1));
  }, [index]);

  const selectScore = (raw: number) => {
    const next = [...answers, raw];
    if (next.length >= total) {
      setPss10RawScores(next);
      router.replace('/mind/pss10-done');
    } else {
      setAnswers(next);
    }
  };

  if (!q) return null;

  return (
    <MindScreenBackdrop variant="pss10">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MindPss10Header
            onBack={onBack}
            current={currentStep}
            total={total}
          />
          <MindQuestionCard
            title={q.en}
            subtitle={q.hi}
            gradientColors={[mindTheme.pssQuestionStart, mindTheme.pssQuestionEnd]}
          />
          <View style={styles.opts}>
            {PSS10_LIKERT_OPTIONS.map((o) => (
              <MindOptionCard
                key={o.label}
                emoji={o.emoji}
                label={o.label}
                selectionBorderColor={mindTheme.pssOptionBorder}
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

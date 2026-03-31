import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  EyeSurfacePanel,
  EyeBinaryChoice,
  EyePrimaryButton,
} from '@healthscan/ui';
import { SYMPTOM_QUESTIONS } from '@/lib/eyeScreeningContent';
import { useEyeScreeningStore } from '@/lib/eyeScreeningStore';

export default function SymptomsScreen() {
  const symptoms = useEyeScreeningStore((s) => s.symptoms);
  const setSymptom = useEyeScreeningStore((s) => s.setSymptom);

  const allAnswered = symptoms.every((v) => v !== null);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader
        title="Symptom Questionnaire"
        progress="6/6"
        onBack={() => router.replace('/screening/amsler/os')}
      />
      <ScrollView contentContainerStyle={styles.body}>
        {SYMPTOM_QUESTIONS.map((q, i) => (
          <EyeSurfacePanel key={`symptom-${i}`} style={styles.card}>
            <Text style={styles.q}>{q}</Text>
            <EyeBinaryChoice
              stretch
              value={symptoms[i]}
              onYes={() => setSymptom(i, true)}
              onNo={() => setSymptom(i, false)}
            />
          </EyeSurfacePanel>
        ))}
        <EyePrimaryButton
          title="Generate Report →"
          disabled={!allAnswered}
          onPress={() => router.replace('/screening/results')}
          style={styles.ctaMargin}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  body: {
    padding: eyeTheme.screenPad,
    paddingBottom: eyeTheme.screenPadBottom,
    gap: 14,
  },
  card: { padding: 16 },
  q: {
    fontSize: 16,
    fontWeight: '700',
    color: eyeTheme.primaryBold,
    marginBottom: 14,
    lineHeight: 22,
  },
  ctaMargin: { marginTop: 8 },
});

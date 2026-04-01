import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { theme } from '@healthscan/ui';
import { eyeTheme, mindTheme } from '@healthscan/ui';
import { webScrollContent } from '@/lib/webLayout';

export default function TestsHub() {
  return (
    <ScrollView
      style={styles.bg}
      contentContainerStyle={
        Platform.OS === 'web'
          ? webScrollContent.centeredColumn
          : styles.wrap
      }
    >
      <Text style={styles.h}>Screenings</Text>
      <Text style={styles.p}>
        The EyeCare protocol runs visual acuity, near vision, color plates,
        contrast sensitivity, Amsler grid, and a symptom questionnaire — then
        produces a triage-style report.
      </Text>
      <Pressable style={styles.card} onPress={() => router.push('/screening')}>
        <Text style={styles.cardTitle}>MobiLab EyeCare · Full protocol</Text>
        <Text style={styles.cardMeta}>
          ~12–18 min · Same flow on web and mobile
        </Text>
        <View style={styles.startPill}>
          <Text style={styles.startTxt}>Start</Text>
        </View>
      </Pressable>

      <Pressable style={styles.mindCard} onPress={() => router.push('/mind')}>
        <Text style={styles.mindTitle}>MindCare · Dashboard</Text>
        <Text style={styles.cardMeta}>
          Daily activities, screenings (PHQ-9, GAD-7, PSS-10), and crisis
          resources · shared UI on all platforms
        </Text>
        <View style={styles.mindPill}>
          <Text style={styles.mindPillTxt}>Open</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg, paddingBottom: 40 },
  h: { fontSize: theme.type.xl, fontWeight: '700', color: theme.colors.text },
  p: {
    marginTop: theme.space.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.space.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: theme.type.lg,
    color: eyeTheme.primary,
  },
  cardMeta: {
    color: theme.colors.textSecondary,
    marginVertical: theme.space.sm,
  },
  startPill: {
    alignSelf: 'flex-start',
    marginTop: theme.space.sm,
    backgroundColor: eyeTheme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  startTxt: { color: '#fff', fontWeight: '700' },
  mindCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.space.md,
  },
  mindTitle: {
    fontWeight: '700',
    fontSize: theme.type.lg,
    color: mindTheme.primary,
  },
  mindPill: {
    alignSelf: 'flex-start',
    marginTop: theme.space.sm,
    backgroundColor: mindTheme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  mindPillTxt: { color: '#fff', fontWeight: '700' },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  theme,
  Button,
  HealthGauge,
  RiskPill,
  type RiskLevel,
  MedicalDisclaimer,
} from '@healthscan/ui';
import { useAuth } from '@/context/auth';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { api } = useAuth();
  const q = useQuery({
    queryKey: ['result', id],
    queryFn: () =>
      api.results.one(id) as Promise<{
        unifiedScore?: number;
        risk?: RiskLevel;
        subtests?: { key: string; score?: number }[];
      }>,
  });

  const risk = (q.data?.risk ?? 'green') as RiskLevel;

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.wrap}>
      <Text style={styles.h}>Your screening snapshot</Text>
      <HealthGauge value={q.data?.unifiedScore ?? null} />
      <RiskPill level={risk} style={{ marginTop: theme.space.md }} />
      <Text style={styles.p}>
        Scores are screening-only and depend on device and environment.
      </Text>
      {q.data?.subtests?.length ? (
        <View style={styles.list}>
          <Text style={styles.subh}>Subtests</Text>
          {q.data.subtests.map((s) => (
    <Text key={String(s.key)} style={styles.item}>
              {String(s.key)}: {s.score ?? '—'}
            </Text>
          ))}
        </View>
      ) : null}
      <Button title="Back to home" onPress={() => router.replace('/(tabs)')} />
      <MedicalDisclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg, paddingBottom: 40 },
  h: { fontSize: theme.type.xl, fontWeight: '700', color: theme.colors.text },
  p: { marginTop: theme.space.md, color: theme.colors.textSecondary, lineHeight: 22 },
  list: { marginVertical: theme.space.lg },
  subh: { fontWeight: '600', color: theme.colors.text, marginBottom: theme.space.sm },
  item: { color: theme.colors.textSecondary, marginBottom: 4 },
});

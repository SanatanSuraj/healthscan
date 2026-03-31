import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  theme,
  HealthGauge,
  Card,
  Button,
  MedicalDisclaimer,
} from '@healthscan/ui';
import { useAuth } from '@/context/auth';

export default function HomeScreen() {
  const { api } = useAuth();
  const q = useQuery({
    queryKey: ['scores', 'latest'],
    queryFn: () => api.scores.latest() as Promise<{
      unified?: number;
      mind?: number;
      vision?: number;
      risk?: string;
    } | null>,
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.wrap}>
      <Text style={styles.greet}>Welcome back</Text>
      <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      <Card style={{ marginTop: theme.space.lg }}>
        <HealthGauge value={q.data?.unified ?? null} />
        {q.isError ? (
          <Text style={styles.warn}>Connect to the API to load scores.</Text>
        ) : null}
      </Card>
      <View style={styles.row}>
        <SummaryCard
          title="Mind"
          value={q.data?.mind}
          onPress={() => router.push('/mind')}
          style={{ marginRight: theme.space.md }}
        />
        <SummaryCard
          title="Vision"
          value={q.data?.vision}
          onPress={() => router.push('/eye')}
        />
      </View>
      <Button title="Quick test — Mind" onPress={() => router.push('/mind')} />
      <View style={{ height: theme.space.sm }} />
      <Button
        title="Quick test — Vision"
        variant="secondary"
        onPress={() => router.push('/eye')}
      />
      <MedicalDisclaimer />
    </ScrollView>
  );
}

function SummaryCard({
  title,
  value,
  onPress,
  style,
}: {
  title: string;
  value?: number;
  onPress: () => void;
  style?: object;
}) {
  return (
    <Pressable style={[styles.mini, style]} onPress={onPress} accessibilityRole="button">
      <Text style={styles.miniTitle}>{title}</Text>
      <Text style={styles.miniVal}>{value == null ? '—' : value}</Text>
      <Text style={styles.miniHint}>Last module score</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg, paddingBottom: 48 },
  greet: {
    fontSize: theme.type.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  date: { color: theme.colors.textSecondary, marginTop: 4 },
  row: {
    flexDirection: 'row',
    marginVertical: theme.space.lg,
  },
  mini: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  miniTitle: { fontWeight: '600', color: theme.colors.text },
  miniVal: {
    fontSize: theme.type.xl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: theme.space.sm,
  },
  miniHint: {
    fontSize: theme.type.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  warn: { color: theme.colors.riskYellow, marginTop: theme.space.sm },
});

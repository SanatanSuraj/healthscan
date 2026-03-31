import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { theme, TrendChart, type TrendPoint } from '@healthscan/ui';
import { useAuth } from '@/context/auth';

export default function ReportsScreen() {
  const { api } = useAuth();
  const q = useQuery({
    queryKey: ['scores', 'history', '30d'],
    queryFn: () =>
      api.scores.history('30d') as Promise<{
        points: { createdAt: string; unifiedScore?: number }[];
      }>,
  });

  const points: TrendPoint[] = useMemo(() => {
    const rows = q.data?.points ?? [];
    return rows.map((r, i) => ({
      at: r.createdAt,
      value: r.unifiedScore ?? 0,
      label: String(i + 1),
    }));
  }, [q.data]);

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.wrap}>
      <Text style={styles.h}>Trends</Text>
      <Text style={styles.p}>Unified screening score — last ~30 days.</Text>
      <View style={styles.chartBox}>
        <TrendChart points={points} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg },
  h: { fontSize: theme.type.xl, fontWeight: '700', color: theme.colors.text },
  p: { marginTop: theme.space.sm, color: theme.colors.textSecondary },
  chartBox: {
    marginTop: theme.space.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});

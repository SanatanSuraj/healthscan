import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './theme';

export function HealthGauge({
  value,
  max = 100,
  label = 'Unified screening score',
}: {
  value: number | null | undefined;
  max?: number;
  label?: string;
}) {
  const v = value == null || Number.isNaN(value) ? null : Math.max(0, Math.min(max, value));
  const pct = v == null ? 0 : Math.round((v / max) * 100);
  return (
    <View style={styles.root} accessibilityRole="summary">
      <Text style={styles.value} accessibilityLabel={`Score ${v ?? 'unknown'} out of ${max}`}>
        {v == null ? '—' : v}
      </Text>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', paddingVertical: theme.space.md },
  value: {
    fontSize: theme.type.display,
    fontWeight: '700',
    color: theme.colors.text,
  },
  label: {
    marginTop: theme.space.sm,
    fontSize: theme.type.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  track: {
    marginTop: theme.space.md,
    height: 10,
    width: '100%',
    maxWidth: 280,
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
});

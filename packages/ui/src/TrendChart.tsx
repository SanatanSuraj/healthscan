import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from './theme';

export interface TrendPoint {
  at: string;
  value: number;
  label?: string;
}

/** Lightweight bar chart — same component on native + web (no SVG). */
export function TrendChart({ points, max = 100 }: { points: TrendPoint[]; max?: number }) {
  if (!points.length) {
    return (
      <Text style={styles.empty}>Complete a screening to see trends.</Text>
    );
  }
  const w = Math.max(320, points.length * 28);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[styles.row, { width: w, minHeight: 120 }]}>
        {points.map((p, i) => {
          const h = Math.round((p.value / max) * 80);
          return (
            <React.Fragment key={i}>
              <View style={[styles.col, i > 0 && styles.colSpacer]}>
                <View style={[styles.bar, { height: h }]} />
                <Text style={styles.axis} numberOfLines={1}>
                  {p.label ?? String(i + 1)}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: theme.space.md,
  },
  col: {
    width: 24,
    alignItems: 'center',
  },
  colSpacer: { marginLeft: theme.space.sm },
  bar: {
    width: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  axis: {
    marginTop: 4,
    fontSize: 9,
    color: theme.colors.textSecondary,
    maxWidth: 28,
    textAlign: 'center',
  },
  empty: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.sm,
    padding: theme.space.md,
  },
});

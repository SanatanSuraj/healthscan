import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { theme } from './theme';

export type RiskLevel = 'green' | 'yellow' | 'red';

const map: Record<
  RiskLevel,
  { bg: string; label: string; text: string; hint: string }
> = {
  green: {
    bg: theme.colors.riskGreen + '22',
    label: 'Lower concern',
    text: theme.colors.riskGreen,
    hint: 'Screening suggests typical range. Not a diagnosis.',
  },
  yellow: {
    bg: theme.colors.riskYellow + '22',
    label: 'Moderate attention',
    text: theme.colors.riskYellow,
    hint: 'Consider lifestyle steps and routine follow-up.',
  },
  red: {
    bg: theme.colors.riskRed + '22',
    label: 'Higher concern',
    text: theme.colors.riskRed,
    hint: 'Strongly consider a qualified clinician. This is not a diagnosis.',
  },
};

export function RiskPill({
  level,
  style,
}: {
  level: RiskLevel;
  style?: ViewStyle;
}) {
  const c = map[level];
  return (
    <View
      style={[styles.wrap, { backgroundColor: c.bg }, style]}
      accessibilityRole="text"
      accessibilityLabel={`Risk band: ${c.label}. ${c.hint}`}
    >
      <Text style={[styles.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.type.sm,
    fontWeight: '600',
  },
});

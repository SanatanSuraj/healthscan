import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { theme } from './theme';

export function Card({ style, ...p }: ViewProps) {
  return <View style={[styles.card, style]} {...p} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});

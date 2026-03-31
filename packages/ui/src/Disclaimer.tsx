import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from './theme';

export function MedicalDisclaimer() {
  return (
    <Text
      style={styles.text}
      accessibilityRole="text"
    >
      HealthScan is a screening tool, not a medical diagnosis. Always consult a
      licensed professional for clinical concerns.
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: theme.type.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginTop: theme.space.md,
  },
});

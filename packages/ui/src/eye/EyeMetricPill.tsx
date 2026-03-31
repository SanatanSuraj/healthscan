import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';

export function EyeMetricPill({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: eyeTheme.metricPillBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    color: eyeTheme.textMuted,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { eyePressableWeb } from './platform';

export function EyeSelectField({
  label,
  valueLabel,
  onPress,
}: {
  label: string;
  valueLabel: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.lab}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={[styles.select, eyePressableWeb]}
        accessibilityRole="button"
      >
        <Text style={styles.selectText}>{valueLabel}</Text>
        <Text style={styles.chev}>⌄</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1 },
  lab: {
    fontSize: 13,
    color: eyeTheme.textMuted,
    marginBottom: 6,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: eyeTheme.surface,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    borderRadius: eyeTheme.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectText: { fontSize: 16, color: eyeTheme.textDark },
  chev: { fontSize: 16, color: eyeTheme.textMuted },
});

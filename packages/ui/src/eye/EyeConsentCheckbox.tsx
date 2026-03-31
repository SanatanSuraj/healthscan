import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { eyePressableWeb } from './platform';

export function EyeConsentCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Pressable
      style={[styles.row, eyePressableWeb]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>
        {checked ? <Text style={styles.tick}>✓</Text> : null}
      </View>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: eyeTheme.border,
    borderRadius: eyeTheme.radiusCheckbox,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: eyeTheme.surface,
  },
  checkboxOn: {
    borderColor: eyeTheme.primary,
    backgroundColor: eyeTheme.mint,
  },
  tick: { fontSize: 14, fontWeight: '800', color: eyeTheme.primary },
  text: {
    flex: 1,
    fontSize: 13,
    color: eyeTheme.textSecondary,
    lineHeight: 20,
  },
});

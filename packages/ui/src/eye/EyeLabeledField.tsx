import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { eyeInputWeb } from './platform';

export function EyeLabeledField({
  label,
  ...input
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.lab}>{label}</Text>
      <TextInput
        placeholderTextColor={eyeTheme.textMuted}
        style={[styles.input, eyeInputWeb]}
        {...input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  lab: {
    fontSize: 13,
    color: eyeTheme.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: eyeTheme.surface,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    borderRadius: eyeTheme.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: eyeTheme.textDark,
  },
});

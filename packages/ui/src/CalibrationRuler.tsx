import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { theme } from './theme';

export function CalibrationCard({
  cardWidthPx,
  onChangeWidth,
  largeText = false,
  inputProps,
}: {
  cardWidthPx: string;
  onChangeWidth: (v: string) => void;
  largeText?: boolean;
  inputProps?: TextInputProps;
}) {
  const fs = largeText ? theme.type.lg : theme.type.body;
  return (
    <View style={styles.card}>
      <Text style={[styles.title, { fontSize: fs }]}>
        Screen calibration
      </Text>
      <Text style={styles.body}>
        Hold a standard credit card against your screen. Measure the card width
        in pixels (use a ruler app or device diagnostics if needed) and enter
        it below.
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="e.g. 250"
        value={cardWidthPx}
        onChangeText={onChangeWidth}
        accessibilityLabel="Credit card width in pixels"
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.space.sm,
  },
  body: {
    fontSize: theme.type.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.space.md,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.space.md,
    fontSize: theme.type.body,
    minHeight: 48,
  },
});

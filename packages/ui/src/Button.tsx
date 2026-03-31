import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  View,
} from 'react-native';
import { theme } from './theme';

export function Button({
  title,
  variant = 'primary',
  ...rest
}: PressableProps & { title: string; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const bg =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'secondary'
        ? theme.colors.secondary
        : 'transparent';
  const color =
    variant === 'ghost' ? theme.colors.primary : '#fff';
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
        variant === 'ghost' && styles.ghostBorder,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...rest}
    >
      <View>
        <Text style={[styles.label, { color }]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBorder: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  label: { fontSize: theme.type.body, fontWeight: '600' },
});

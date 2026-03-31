import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { eyePressableWeb } from './platform';

export type EyePrimaryButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: 'pill' | 'rounded';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EyePrimaryButton({
  title,
  variant = 'rounded',
  disabled,
  style,
  ...rest
}: EyePrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'pill' ? styles.pill : styles.rounded,
        disabled ? styles.off : styles.on,
        { opacity: pressed && !disabled ? 0.88 : 1 },
        eyePressableWeb,
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: { borderRadius: eyeTheme.radiusFull },
  rounded: { borderRadius: eyeTheme.radiusMd },
  on: { backgroundColor: eyeTheme.primary },
  off: { backgroundColor: eyeTheme.disabledBtn },
  label: {
    color: eyeTheme.onPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  labelDisabled: { opacity: 0.95 },
});

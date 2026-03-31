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

export type EyeOutlineButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  style?: StyleProp<ViewStyle>;
};

export function EyeOutlineButton({ title, style, ...rest }: EyeOutlineButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.base,
        { opacity: pressed ? 0.88 : 1 },
        eyePressableWeb,
        style,
      ]}
      {...rest}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderColor: eyeTheme.primary,
    borderRadius: eyeTheme.radiusMd,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: eyeTheme.surface,
  },
  label: {
    color: eyeTheme.primary,
    fontWeight: '800',
    fontSize: 16,
  },
});

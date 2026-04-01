import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type PressableProps,
} from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb } from './mindPlatform';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

export function MindPurpleButton({
  title,
  style,
  backgroundColor,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: backgroundColor ?? mindTheme.btnPurple },
        { opacity: pressed ? 0.9 : 1 },
        mindPressableWeb,
        style,
      ]}
      {...rest}
    >
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: mindTheme.radiusSm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  txt: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});

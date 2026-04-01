import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb } from './mindPlatform';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  style?: StyleProp<ViewStyle>;
};

export function MindMutedButton({ title, style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
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
    backgroundColor: mindTheme.btnMuted,
    borderRadius: mindTheme.radiusSm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  txt: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});

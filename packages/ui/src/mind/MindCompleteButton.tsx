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

/** Periwinkle CTA from mood “check-in complete” mockup */
export function MindCompleteButton({ title, style, ...rest }: Props) {
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
    backgroundColor: mindTheme.btnComplete,
    borderRadius: mindTheme.radiusPill,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  txt: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});

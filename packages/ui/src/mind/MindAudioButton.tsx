import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb } from './mindPlatform';

export function MindAudioButton({
  onPress,
}: {
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress ?? (() => undefined)}
      style={[styles.circle, mindPressableWeb]}
      accessibilityRole="button"
      accessibilityLabel="Read aloud"
    >
      <Text style={styles.ico} accessibilityElementsHidden>
        🔊
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: mindTheme.speakerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ico: { fontSize: 20 },
});

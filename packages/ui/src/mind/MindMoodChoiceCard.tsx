import React from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb, mindTextNoSelectWeb } from './mindPlatform';

const shadow: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

export function MindMoodChoiceCard({
  emoji,
  label,
  onPress,
  selected,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow,
        selected && styles.selected,
        pressed && { opacity: 0.93 },
        mindPressableWeb,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.lab, mindTextNoSelectWeb]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 76,
    minHeight: 96,
    backgroundColor: '#FFFFFF',
    borderRadius: mindTheme.radiusMd,
    borderWidth: 1,
    borderColor: mindTheme.progressTrack,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: mindTheme.gapMd,
  },
  selected: {
    borderColor: mindTheme.primary,
    borderWidth: 2,
  },
  emoji: { fontSize: 30, marginBottom: 8 },
  lab: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
});

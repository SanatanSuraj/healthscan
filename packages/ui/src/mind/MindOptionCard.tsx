import React from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb, mindTextNoSelectWeb } from './mindPlatform';

const shadow: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
};

export function MindOptionCard({
  emoji,
  label,
  selected,
  selectionBorderColor,
  onPress,
}: {
  emoji: string;
  label: string;
  selected?: boolean;
  selectionBorderColor?: string;
  onPress: () => void;
}) {
  const border = selectionBorderColor ?? mindTheme.optionSelectedBorder;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow,
        selected && { borderColor: border },
        pressed && { opacity: 0.92 },
        mindPressableWeb,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, mindTextNoSelectWeb]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: mindTheme.radiusMd,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: mindTheme.gapMd,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emoji: { fontSize: 28, marginRight: 14 },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: mindTheme.text,
  },
});

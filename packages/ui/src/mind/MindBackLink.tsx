import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb } from './mindPlatform';

export function MindBackLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, mindPressableWeb]}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <Text style={styles.txt}>← Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 4,
  },
  txt: {
    fontSize: 16,
    fontWeight: '600',
    color: mindTheme.backLink,
  },
});

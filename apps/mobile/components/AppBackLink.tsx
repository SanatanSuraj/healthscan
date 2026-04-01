import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { Href } from 'expo-router';
import { theme } from '@healthscan/ui';
import { goBackOrReplace } from '@/lib/navigation';

export function AppBackLink({
  fallbackHref,
  label = '← Back',
}: {
  fallbackHref: Href;
  label?: string;
}) {
  return (
    <Pressable
      onPress={() => goBackOrReplace(fallbackHref)}
      hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Text style={styles.txt}>{label}</Text>
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
    color: theme.colors.primary,
  },
});

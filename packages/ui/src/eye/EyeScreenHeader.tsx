import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { eyePressableWeb } from './platform';

export type EyeScreenHeaderProps = {
  title: string;
  progress?: string;
  onBack: () => void;
};

export function EyeScreenHeader({ title, progress, onBack }: EyeScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onBack}
        style={[styles.back, eyePressableWeb]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>←</Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {progress ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{progress}</Text>
        </View>
      ) : (
        <View style={styles.badgeSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: eyeTheme.screenPad,
    paddingVertical: 12,
    gap: 8,
  },
  back: {
    width: eyeTheme.hitBack,
    height: eyeTheme.hitBack,
    borderRadius: eyeTheme.radiusSm,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    backgroundColor: eyeTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: eyeTheme.primary },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: eyeTheme.primary,
  },
  badge: {
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: eyeTheme.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: eyeTheme.primary },
  badgeSpacer: { width: 44, height: 32 },
});

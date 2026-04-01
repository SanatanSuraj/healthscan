import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb } from './mindPlatform';

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

export function MindHealthToolCard({
  icon,
  title,
  subtitle,
  badge,
  backgroundColor,
  titleColor,
  subtitleColor,
  badgeBg,
  badgeTextColor,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  badgeBg: string;
  badgeTextColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow,
        { backgroundColor },
        pressed && { opacity: 0.94 },
        mindPressableWeb,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={[styles.ico, styles.icoPad]}>{icon}</Text>
      <View style={styles.mid}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <Text style={[styles.sub, { color: subtitleColor }]}>{subtitle}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <Text style={[styles.badgeTxt, { color: badgeTextColor }]}>{badge}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: mindTheme.radiusLg,
    padding: mindTheme.gapLg,
    marginBottom: mindTheme.gapMd,
  },
  ico: { fontSize: 36 },
  icoPad: { marginRight: 12 },
  mid: { flex: 1, marginRight: 12 },
  title: { fontSize: 17, fontWeight: '800' },
  sub: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: mindTheme.radiusPill,
  },
  badgeTxt: { fontSize: 14, fontWeight: '800' },
});

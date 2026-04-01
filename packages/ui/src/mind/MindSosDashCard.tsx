import React from 'react';
import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';
import { mindTheme } from '../mindTheme';
import { mindPressableWeb } from './mindPlatform';

export function MindSosDashCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        Platform.OS === 'android' ? styles.cardBorderSolid : styles.cardBorderDashed,
        { opacity: pressed ? 0.94 : 1 },
        mindPressableWeb,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Need help now, confidential support"
    >
      <Text style={styles.sosIco} accessibilityElementsHidden>
        🆘
      </Text>
      <View style={styles.copy}>
        <Text style={styles.title}>Need Help Now?</Text>
        <Text style={styles.sub}>24/7 confidential support</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: mindTheme.sosDashBg,
    borderRadius: mindTheme.radiusLg,
    borderWidth: 2,
    borderColor: mindTheme.sosDashBorder,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: mindTheme.gapMd,
  },
  cardBorderDashed: {
    borderStyle: 'dashed',
  },
  cardBorderSolid: {
    borderStyle: 'solid',
  },
  sosIco: { fontSize: 28, marginRight: 14 },
  copy: { flex: 1 },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: mindTheme.sosDashTitle,
  },
  sub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: mindTheme.sosDashSub,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mindTheme } from '../mindTheme';
import { MindAudioButton } from './MindAudioButton';
import { mindTextNoSelectWeb } from './mindPlatform';

export function MindQuestionCard({
  title,
  subtitle,
  onAudioPress,
  gradientColors,
}: {
  title: string;
  subtitle?: string;
  onAudioPress?: () => void;
  gradientColors?: readonly [string, string];
}) {
  const colors = gradientColors ?? [mindTheme.questionCardStart, mindTheme.questionCardEnd];
  return (
    <LinearGradient
      colors={[...colors]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={styles.audioPad}>
          <MindAudioButton onPress={onAudioPress} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, mindTextNoSelectWeb]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.sub, mindTextNoSelectWeb]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: mindTheme.radiusLg,
    padding: mindTheme.gapLg,
    marginBottom: mindTheme.gapLg,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  audioPad: { marginRight: 14 },
  copy: { flex: 1 },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: mindTheme.text,
    lineHeight: 24,
  },
  sub: {
    marginTop: 6,
    fontSize: 15,
    color: mindTheme.textSecondary,
    lineHeight: 22,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { mindTheme } from '../mindTheme';
import { MindBackLink } from './MindBackLink';
import { MindProgressBar } from './MindProgressBar';

export function MindGad7Header({
  onBack,
  current,
  total,
}: {
  onBack: () => void;
  current: number;
  total: number;
}) {
  return (
    <View style={styles.wrap}>
      <MindBackLink onPress={onBack} />
      <View style={styles.titleRow}>
        <Text style={styles.heart} accessibilityLabel="">
          💙
        </Text>
        <Text style={styles.title}>GAD-7 • Anxiety Check</Text>
      </View>
      <Text style={styles.step}>
        {current} / {total}
      </Text>
      <View style={styles.barPad}>
        <MindProgressBar
          current={current}
          total={total}
          trackColor={mindTheme.gadProgressTrack}
          fillColor={mindTheme.gadProgressFill}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: mindTheme.gapMd },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  heart: { fontSize: 22 },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: mindTheme.gadTitle,
    flex: 1,
  },
  step: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: mindTheme.textMuted,
  },
  barPad: { marginTop: mindTheme.gapMd },
});

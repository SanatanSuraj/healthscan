import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mindTheme } from '../mindTheme';

export function MindProgressBar({
  current,
  total,
  trackColor,
  fillColor,
}: {
  current: number;
  total: number;
  trackColor?: string;
  fillColor?: string;
}) {
  const t = Math.max(1, total);
  const filled = Math.min(t, Math.max(0, current));
  const rest = t - filled;
  const a = Math.max(0.001, filled);
  const b = Math.max(0.001, rest);
  const track = trackColor ?? mindTheme.progressTrack;
  const fill = fillColor ?? mindTheme.progressFill;
  return (
    <View style={[styles.track, { backgroundColor: track }]}>
      <View style={[styles.fill, { flex: a, backgroundColor: fill }]} />
      <View style={{ flex: b }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 10,
    borderRadius: mindTheme.radiusPill,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: mindTheme.radiusPill,
  },
});

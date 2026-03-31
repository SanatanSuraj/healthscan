import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { eyePressableWeb } from './platform';

export type EyeDirection = 'up' | 'down' | 'left' | 'right';

export type EyeDirectionalPadProps = {
  onDirection: (d: EyeDirection) => void;
  center: React.ReactNode;
};

export function EyeDirectionalPad({ onDirection, center }: EyeDirectionalPadProps) {
  return (
    <View style={styles.dpad}>
      <View style={styles.mid}>
        <View style={styles.row}>
          <View style={styles.corner} />
          <DirBtn dir="up" onPress={() => onDirection('up')} />
          <View style={styles.corner} />
        </View>
        <View style={styles.row}>
          <DirBtn dir="left" onPress={() => onDirection('left')} />
          <View style={styles.centerSlot}>{center}</View>
          <DirBtn dir="right" onPress={() => onDirection('right')} />
        </View>
        <View style={styles.row}>
          <View style={styles.corner} />
          <DirBtn dir="down" onPress={() => onDirection('down')} />
          <View style={styles.corner} />
        </View>
      </View>
    </View>
  );
}

function DirBtn({
  dir,
  onPress,
}: {
  dir: EyeDirection;
  onPress: () => void;
}) {
  const sym =
    dir === 'up' ? '▲' : dir === 'down' ? '▼' : dir === 'left' ? '◀' : '▶';
  return (
    <Pressable
      onPress={onPress}
      style={[styles.dirOuter, eyePressableWeb]}
      accessibilityRole="button"
      accessibilityLabel={`Answer ${dir}`}
    >
      <Text style={styles.dirSym}>{sym}</Text>
    </Pressable>
  );
}

const S = eyeTheme.dpadCell;
const G = eyeTheme.dpadGap;

const styles = StyleSheet.create({
  dpad: { paddingBottom: 32, alignItems: 'center' },
  mid: { width: eyeTheme.dpadWidth },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  corner: { width: S, height: S },
  dirOuter: {
    width: S,
    height: S,
    borderRadius: eyeTheme.radiusMd,
    borderWidth: 2,
    borderColor: eyeTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    margin: G,
    backgroundColor: eyeTheme.surface,
  },
  dirSym: { fontSize: 22, color: eyeTheme.primary, fontWeight: '700' },
  centerSlot: {
    width: S,
    height: S,
    borderRadius: eyeTheme.radiusMd,
    backgroundColor: eyeTheme.metricPillBg,
    alignItems: 'center',
    justifyContent: 'center',
    margin: G,
  },
});

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { eyePressableWeb } from './platform';

export function EyeBinaryChoice({
  value,
  onYes,
  onNo,
  size = 'md',
  stretch,
}: {
  value: boolean | null;
  onYes: () => void;
  onNo: () => void;
  size?: 'sm' | 'md';
  /** Equal-width row (symptom cards) */
  stretch?: boolean;
}) {
  const padV = size === 'sm' ? 8 : 12;
  const padH = size === 'sm' ? 14 : 16;
  const fs = size === 'sm' ? 14 : 16;
  return (
    <View style={[styles.row, stretch && styles.rowStretch]}>
      <Pressable
        onPress={onYes}
        style={[
          styles.pill,
          stretch && styles.pillFlex,
          { paddingVertical: padV, paddingHorizontal: padH },
          value === true ? styles.pillOn : styles.pillOff,
          eyePressableWeb,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Yes"
      >
        <Text
          style={[
            { fontSize: fs },
            styles.pillTxt,
            value === true ? styles.pillTxtOn : styles.pillTxtOff,
          ]}
        >
          Yes
        </Text>
      </Pressable>
      <Pressable
        onPress={onNo}
        style={[
          styles.pill,
          stretch && styles.pillFlex,
          { paddingVertical: padV, paddingHorizontal: padH },
          value === false ? styles.pillOn : styles.pillOff,
          eyePressableWeb,
        ]}
        accessibilityRole="button"
        accessibilityLabel="No"
      >
        <Text
          style={[
            { fontSize: fs },
            styles.pillTxt,
            value === false ? styles.pillTxtOn : styles.pillTxtOff,
          ]}
        >
          No
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  rowStretch: { alignSelf: 'stretch', width: '100%' },
  pill: {
    borderRadius: eyeTheme.radiusSm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: eyeTheme.surface,
  },
  pillFlex: { flex: 1 },
  pillOn: { borderColor: eyeTheme.primary },
  pillOff: { borderColor: eyeTheme.border },
  pillTxt: { fontWeight: '600' },
  pillTxtOn: { color: eyeTheme.primary },
  pillTxtOff: { color: eyeTheme.textMuted },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';

export function EyeWarningBanner({
  icon = '⚠️',
  message,
}: {
  icon?: string;
  message: string;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: eyeTheme.warningBg,
    borderWidth: 1,
    borderColor: eyeTheme.warningBorder,
    borderRadius: eyeTheme.radiusMd,
    padding: 14,
    marginBottom: eyeTheme.screenPad,
  },
  icon: { fontSize: 18, marginRight: 10 },
  text: {
    flex: 1,
    fontWeight: '700',
    color: eyeTheme.warningText,
    fontSize: 14,
    lineHeight: 20,
  },
});

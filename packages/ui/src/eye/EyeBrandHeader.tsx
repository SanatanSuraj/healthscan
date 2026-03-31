import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';

export function EyeBrandHeader({
  appName,
  tagline,
  logo,
}: {
  appName: string;
  tagline: string;
  logo: React.ReactNode;
}) {
  return (
    <View style={styles.brandRow}>
      <View style={styles.logo}>{logo}</View>
      <View style={styles.brandText}>
        <Text style={styles.appName}>{appName}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: eyeTheme.screenPad,
  },
  logo: {
    width: eyeTheme.logoSize,
    height: eyeTheme.logoSize,
    borderRadius: eyeTheme.logoRadius,
    backgroundColor: eyeTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  brandText: { flex: 1 },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: eyeTheme.primary,
  },
  tagline: {
    fontSize: 13,
    color: eyeTheme.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
});

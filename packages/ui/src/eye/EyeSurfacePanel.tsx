import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { eyeTheme } from '../eyeTheme';

export function EyeSurfacePanel({
  style,
  ...rest
}: ViewProps) {
  return <View style={[styles.panel, style]} {...rest} />;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: eyeTheme.surface,
    borderRadius: eyeTheme.radiusMd,
    borderWidth: 1,
    borderColor: eyeTheme.border,
  },
});

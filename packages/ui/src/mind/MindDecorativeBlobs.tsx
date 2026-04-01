import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { mindTheme } from '../mindTheme';

/** Faint background orbs — same layout math on all platforms */
export function MindDecorativeBlobs({ color }: { color?: string }) {
  const { width, height } = useWindowDimensions();
  const d = Math.min(width, height);
  const blobColor = color ?? mindTheme.blob;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View
        style={[
          styles.blob,
          { backgroundColor: blobColor },
          {
            width: d * 0.72,
            height: d * 0.72,
            borderRadius: d * 0.36,
            left: -d * 0.18,
            top: height * 0.38,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          { backgroundColor: blobColor },
          {
            width: d * 0.55,
            height: d * 0.55,
            borderRadius: d * 0.275,
            right: -d * 0.12,
            bottom: height * 0.12,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
});

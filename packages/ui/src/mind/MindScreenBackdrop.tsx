import React from 'react';
import { View, StyleSheet, type ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mindTheme } from '../mindTheme';
import { MindDecorativeBlobs } from './MindDecorativeBlobs';

export type MindBackdropVariant =
  | 'wellness'
  | 'mint'
  | 'gad7'
  | 'pss10'
  | 'breathing'
  | 'sleep';

export function MindScreenBackdrop({
  children,
  variant = 'wellness',
  showBlobs = true,
}: {
  children: React.ReactNode;
  variant?: MindBackdropVariant;
  showBlobs?: boolean;
}) {
  const colors: [ColorValue, ColorValue, ...ColorValue[]] =
    variant === 'mint'
      ? [mindTheme.mintTop, mindTheme.mintBottom]
      : variant === 'gad7'
        ? [mindTheme.gadBgTop, mindTheme.gadBgMid, mindTheme.gadBgBottom]
        : variant === 'pss10'
          ? [mindTheme.pssBgTop, mindTheme.pssBgMid, mindTheme.pssBgBottom]
          : variant === 'breathing'
            ? [
                mindTheme.breathBgTop,
                mindTheme.breathBgMid,
                mindTheme.breathBgBottom,
              ]
            : variant === 'sleep'
              ? [
                  mindTheme.sleepBgTop,
                  mindTheme.sleepBgMid,
                  mindTheme.sleepBgBottom,
                ]
              : [mindTheme.bgTop, mindTheme.bgMid, mindTheme.bgBottom];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      {showBlobs && variant === 'wellness' ? <MindDecorativeBlobs /> : null}
      {showBlobs && variant === 'gad7' ? (
        <MindDecorativeBlobs color={mindTheme.gadBlob} />
      ) : null}
      {showBlobs && variant === 'pss10' ? (
        <MindDecorativeBlobs color={mindTheme.pssBlob} />
      ) : null}
      {showBlobs && variant === 'breathing' ? (
        <MindDecorativeBlobs color={mindTheme.breathBlob} />
      ) : null}
      {showBlobs && variant === 'sleep' ? (
        <MindDecorativeBlobs color={mindTheme.sleepBlob} />
      ) : null}
      <View style={styles.foreground}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  foreground: { flex: 1 },
});

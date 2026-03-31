import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';
import { EyePrimaryButton } from './EyePrimaryButton';

export type EyeModuleIntroLayoutProps = {
  header: React.ReactNode;
  icon: React.ReactNode;
  headline: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
};

/**
 * Shared intro body for Near / Color / Contrast / Amsler modules.
 */
export function EyeModuleIntroLayout({
  header,
  icon,
  headline,
  body,
  ctaLabel,
  onCta,
}: EyeModuleIntroLayoutProps) {
  return (
    <View style={styles.root}>
      {header}
      <View style={styles.body}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.copy}>{body}</Text>
      </View>
      <View style={styles.footer}>
        <EyePrimaryButton title={ctaLabel} onPress={onCta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: {
    flex: 1,
    paddingHorizontal: eyeTheme.introPadH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: eyeTheme.iconTileSize,
    height: eyeTheme.iconTileSize,
    borderRadius: eyeTheme.iconTileRadius,
    backgroundColor: eyeTheme.mintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: eyeTheme.screenPad,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: eyeTheme.primary,
    marginBottom: 14,
    textAlign: 'center',
  },
  copy: {
    fontSize: 16,
    color: eyeTheme.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: eyeTheme.maxCopyWidth,
  },
  footer: {
    padding: eyeTheme.screenPad,
    paddingBottom: 28,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  EyeModuleIntroLayout,
} from '@healthscan/ui';

export default function ContrastIntro() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: eyeTheme.bg }} edges={['top', 'bottom']}>
      <EyeModuleIntroLayout
        header={
          <EyeScreenHeader
            title="Contrast Sensitivity"
            progress="4/6"
            onBack={() => router.replace('/screening/color-test')}
          />
        }
        icon={
          <View style={styles.contrastIco}>
            <View style={styles.halfBlack} />
            <View style={styles.halfWhite} />
          </View>
        }
        headline="Contrast Sensitivity"
        body="Identify the direction the E is pointing. It will get progressively fainter."
        ctaLabel="Start Screening →"
        onCta={() => router.push('/screening/contrast-test')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contrastIco: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#111',
  },
  halfBlack: { flex: 1, backgroundColor: '#000' },
  halfWhite: { flex: 1, backgroundColor: '#fff' },
});

import React from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  EyeModuleIntroLayout,
} from '@healthscan/ui';
import { goBackOrReplace } from '@/lib/navigation';

export default function NearVisionIntro() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: eyeTheme.bg }} edges={['top', 'bottom']}>
      <EyeModuleIntroLayout
        header={
          <EyeScreenHeader
            title="Near Vision"
            progress="2/6"
            onBack={() => goBackOrReplace('/screening/visual-acuity')}
          />
        }
        icon={<Text style={{ fontSize: 44 }}>📖</Text>}
        headline="Near Vision"
        body="Hold the device at normal reading distance (30-40 cm). Read the smallest line you can see clearly."
        ctaLabel="Start Screening →"
        onCta={() => router.push('/screening/near-chart')}
      />
    </SafeAreaView>
  );
}

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

export default function AmslerIntro() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: eyeTheme.bg }} edges={['top', 'bottom']}>
      <EyeModuleIntroLayout
        header={
          <EyeScreenHeader
            title="Amsler Grid"
            progress="5/6"
            onBack={() => goBackOrReplace('/screening/contrast-test')}
          />
        }
        icon={
          <Text style={{ fontSize: 40, fontWeight: '700', color: eyeTheme.primary }}>▦</Text>
        }
        headline="Amsler Grid"
        body="Cover one eye. Focus on the center dot. Tap any areas where lines appear wavy, distorted, or missing."
        ctaLabel="Start Screening →"
        onCta={() => router.push('/screening/amsler/od')}
      />
    </SafeAreaView>
  );
}

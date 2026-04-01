import React from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  EyeModuleIntroLayout,
} from '@healthscan/ui';
import { useEyeScreeningStore } from '@/lib/eyeScreeningStore';
import { goBackOrReplace } from '@/lib/navigation';

export default function ColorVisionIntro() {
  const resetColor = () => {
    useEyeScreeningStore.setState({ colorResults: [] });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: eyeTheme.bg }} edges={['top', 'bottom']}>
      <EyeModuleIntroLayout
        header={
          <EyeScreenHeader
            title="Color Vision"
            progress="3/6"
            onBack={() => {
              resetColor();
              goBackOrReplace('/screening/near-chart');
            }}
          />
        }
        icon={<Text style={{ fontSize: 44 }}>🌈</Text>}
        headline="Color Vision"
        body="Identify the number or shape hidden within the colored dots. Tap your answer."
        ctaLabel="Start Screening →"
        onCta={() => router.push('/screening/color-test')}
      />
    </SafeAreaView>
  );
}

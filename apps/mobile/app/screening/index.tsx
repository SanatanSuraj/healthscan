import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeBrandHeader,
  EyeWarningBanner,
  EyeListCard,
  EyeModuleListRow,
  EyeListRowDivider,
  EyeConsentCheckbox,
  EyePrimaryButton,
} from '@healthscan/ui';
import { useEyeScreeningStore } from '@/lib/eyeScreeningStore';

const MODULES: { icon: string; label: string }[] = [
  { icon: '👁️', label: 'Visual Acuity Test' },
  { icon: '📖', label: 'Near Vision Test' },
  { icon: '🌈', label: 'Color Vision Screening' },
  { icon: '◑', label: 'Contrast Sensitivity' },
  { icon: '▦', label: 'Amsler Grid (Macular)' },
  { icon: '📋', label: 'Symptom Questionnaire' },
];

export default function ScreeningLanding() {
  const consent = useEyeScreeningStore((s) => s.consent);
  const setConsent = useEyeScreeningStore((s) => s.setConsent);
  const resetClinicalData = useEyeScreeningStore((s) => s.resetClinicalData);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <EyeBrandHeader
          appName="MobiLab EyeCare"
          tagline="Primary Eye Screening & Triage Platform"
          logo={<Text style={styles.logoEye}>👁</Text>}
        />

        <EyeWarningBanner message="This is a screening tool, not a diagnostic substitute." />

        <EyeListCard title="Screening Modules">
          {MODULES.map((m, i) => (
            <View key={m.label}>
              {i > 0 ? <EyeListRowDivider /> : null}
              <EyeModuleListRow icon={m.icon} label={m.label} />
            </View>
          ))}
        </EyeListCard>

        <EyeConsentCheckbox
          checked={consent}
          onToggle={() => setConsent(!consent)}
          label="I understand this is a screening tool and not a replacement for professional ophthalmic examination."
        />

        <EyePrimaryButton
          title="Start Screening"
          variant="pill"
          disabled={!consent}
          onPress={() => {
            resetClinicalData();
            router.push('/screening/patient');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  scroll: {
    padding: eyeTheme.screenPad,
    paddingBottom: eyeTheme.screenPadBottom,
  },
  logoEye: { fontSize: 28, color: eyeTheme.onPrimary },
});

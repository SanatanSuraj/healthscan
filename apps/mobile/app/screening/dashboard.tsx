import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eyeTheme, EyeScreenHeader } from '@healthscan/ui';

export default function DoctorDashboardPlaceholder() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader title="Doctor Dashboard" onBack={() => router.back()} />
      <View style={styles.body}>
        <Text style={styles.p}>
          Specialist review queue, cohort exports, and device calibration audit
          will connect to your deployment API from this screen.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  body: { padding: eyeTheme.screenPad },
  p: { fontSize: 16, color: eyeTheme.textSecondary, lineHeight: 24 },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eyeTheme, EyeScreenHeader } from '@healthscan/ui';
import { goBackOrReplace } from '@/lib/navigation';

export default function EyeEducationPlaceholder() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader
        title="Eye Health Education"
        onBack={() => goBackOrReplace('/screening/results')}
      />
      <View style={styles.body}>
        <Text style={styles.p}>
          Short, trusted education leaflets (diabetic eye disease, cataract
          awareness, UV protection) will appear here for offline clinics.
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

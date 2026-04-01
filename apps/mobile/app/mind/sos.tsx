import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindBackLink,
  MindHelplineCard,
} from '@healthscan/ui';
import { goBackOrReplace } from '@/lib/navigation';

export default function MindSosScreen() {
  return (
    <MindScreenBackdrop>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <MindBackLink onPress={() => goBackOrReplace('/mind')} />
          <MindHelplineCard />
        </ScrollView>
      </SafeAreaView>
    </MindScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
  },
});

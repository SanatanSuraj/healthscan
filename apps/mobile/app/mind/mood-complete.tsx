import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindBackLink,
  MindCompleteButton,
  mindTextNoSelectWeb,
} from '@healthscan/ui';
import { goBackOrReplace } from '@/lib/navigation';

const cardShadow: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 6,
};

export default function MindMoodCompleteScreen() {
  const { mood } = useLocalSearchParams<{ mood?: string }>();

  return (
    <MindScreenBackdrop>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.pad}>
          <MindBackLink onPress={() => goBackOrReplace('/mind')} />
          <View style={styles.center}>
            <View style={[styles.card, cardShadow]}>
              <Text style={styles.party}>🎉</Text>
              <Text style={[styles.title, mindTextNoSelectWeb]}>Check-in Complete!</Text>
              <Text style={styles.xp}>+10 XP ⭐</Text>
              {mood ? (
                <Text style={styles.moodNote} numberOfLines={1}>
                  Logged as: {mood}
                </Text>
              ) : null}
              <MindCompleteButton
                title="Back Home 🏠"
                onPress={() => router.replace('/(tabs)')}
                style={styles.btn}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </MindScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pad: {
    flex: 1,
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
  },
  center: { flex: 1, justifyContent: 'center' },
  card: {
    backgroundColor: mindTheme.moodCompleteCard,
    borderRadius: mindTheme.radiusLg,
    padding: mindTheme.gapLg + 8,
    alignItems: 'center',
  },
  party: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: mindTheme.greenHeading,
    textAlign: 'center',
  },
  xp: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '700',
    color: mindTheme.greenBody,
  },
  moodNote: {
    marginTop: 8,
    fontSize: 14,
    color: mindTheme.greenMuted,
    fontWeight: '600',
  },
  btn: { marginTop: mindTheme.gapLg },
});

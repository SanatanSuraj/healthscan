import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBackOrReplace } from '@/lib/navigation';
import {
  mindTheme,
  MindScreenBackdrop,
  MindBackLink,
  MindAudioButton,
  MindHealthToolCard,
} from '@healthscan/ui';

export default function MindQuickHealthHub() {
  return (
    <MindScreenBackdrop>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MindBackLink onPress={() => goBackOrReplace('/mind')} />
          <Text style={styles.ico}>🩺</Text>
          <Text style={styles.h}>Quick Health Check</Text>
          <Text style={styles.sub}>Validated screening tools · 2–3 min each</Text>
          <View style={styles.audio}>
            <MindAudioButton />
          </View>

          <MindHealthToolCard
            icon="😊"
            title="Mood Check-in"
            subtitle="How are you feeling?"
            badge="+10"
            backgroundColor="#FFF4C2"
            titleColor="#92400E"
            subtitleColor="#92400E"
            badgeBg="#FDE68A"
            badgeTextColor="#92400E"
            onPress={() => router.push('/mind/mood')}
          />

          <MindHealthToolCard
            icon="💜"
            title="Mood & Energy"
            subtitle="PHQ-9 · 9 Qs"
            badge="+30"
            backgroundColor={mindTheme.healthPurple}
            titleColor={mindTheme.healthPurpleText}
            subtitleColor={mindTheme.healthPurpleText}
            badgeBg="#EDE9FE"
            badgeTextColor={mindTheme.healthPurpleText}
            onPress={() => router.push('/mind/phq9')}
          />
          <MindHealthToolCard
            icon="💙"
            title="Worry & Calm"
            subtitle="GAD-7 · 7 Qs"
            badge="+25"
            backgroundColor={mindTheme.healthBlue}
            titleColor={mindTheme.healthBlueText}
            subtitleColor={mindTheme.healthBlueText}
            badgeBg="#DBEAFE"
            badgeTextColor={mindTheme.healthBlueText}
            onPress={() => router.push('/mind/gad7')}
          />
          <MindHealthToolCard
            icon="🧡"
            title="Stress Snapshot"
            subtitle="PSS-10 · 10 Qs"
            badge="+30"
            backgroundColor={mindTheme.healthOrange}
            titleColor={mindTheme.healthOrangeText}
            subtitleColor={mindTheme.healthOrangeText}
            badgeBg="#FFEDD5"
            badgeTextColor={mindTheme.healthOrangeText}
            onPress={() => router.push('/mind/pss10')}
          />
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
  ico: {
    fontSize: 48,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  h: {
    fontSize: 26,
    fontWeight: '800',
    color: mindTheme.text,
    textAlign: 'center',
  },
  sub: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: mindTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  audio: { alignItems: 'center', marginTop: 16, marginBottom: 8 },
});

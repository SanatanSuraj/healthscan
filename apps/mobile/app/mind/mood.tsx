import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindBackLink,
  MindAudioButton,
  MindMoodChoiceCard,
  mindTextNoSelectWeb,
} from '@healthscan/ui';
import { MOOD_CHOICES } from '@/lib/mindScreeningContent';

export default function MindMoodScreen() {
  return (
    <MindScreenBackdrop>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <MindBackLink onPress={() => router.back()} />
          <Text style={styles.heroEmoji}>😊</Text>
          <Text style={[styles.h, mindTextNoSelectWeb]}>How are you feeling?</Text>
          <View style={styles.audio}>
            <MindAudioButton />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hRow}
          >
            {MOOD_CHOICES.map((m) => (
              <MindMoodChoiceCard
                key={m.id}
                emoji={m.emoji}
                label={m.label}
                onPress={() =>
                  router.push({
                    pathname: '/mind/mood-complete',
                    params: { mood: m.label },
                  })
                }
              />
            ))}
          </ScrollView>
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 72,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  h: {
    fontSize: 22,
    fontWeight: '800',
    color: mindTheme.text,
    textAlign: 'center',
  },
  audio: { alignItems: 'center', marginTop: 16, marginBottom: 24 },
  hRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingRight: mindTheme.screenPad,
    justifyContent: 'center',
    flexGrow: 1,
  },
});

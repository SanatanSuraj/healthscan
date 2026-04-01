import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindScreenBackdrop,
  MindBackLink,
  MindAudioButton,
  MindPurpleButton,
  mindPressableWeb,
  mindTextNoSelectWeb,
} from '@healthscan/ui';
import {
  SLEEP_QUALITY_OPTIONS,
  type SleepQualityId,
} from '@/lib/mindScreeningContent';
import { useMindCareProgressStore } from '@/lib/mindCareProgressStore';

const MIN_HOURS = 0;
const MAX_HOURS = 14;

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

export default function SleepCheckinScreen() {
  const addXp = useMindCareProgressStore((s) => s.addXp);
  const [hours, setHours] = useState(7);
  const [qualityId, setQualityId] = useState<SleepQualityId | null>(null);

  const dec = () =>
    setHours((h) => (h > MIN_HOURS ? h - 1 : MIN_HOURS));
  const inc = () =>
    setHours((h) => (h < MAX_HOURS ? h + 1 : MAX_HOURS));

  return (
    <MindScreenBackdrop variant="sleep">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MindBackLink onPress={() => router.back()} />

          <View style={styles.header}>
            <Text style={styles.moon}>🌙</Text>
            <Text style={[styles.title, mindTextNoSelectWeb]}>
              Sleep Check-in
            </Text>
            <View style={styles.audio}>
              <MindAudioButton />
            </View>
          </View>

          <View style={[styles.hoursCard, cardShadow]}>
            <Text style={[styles.sectionLabel, mindTextNoSelectWeb]}>
              Hours slept
            </Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={dec}
                style={({ pressed }) => [
                  styles.stepBtn,
                  { opacity: pressed ? 0.75 : 1 },
                  mindPressableWeb,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Decrease hours slept"
              >
                <Text style={styles.stepGlyph}>−</Text>
              </Pressable>
              <Text
                style={[styles.hoursValue, mindTextNoSelectWeb]}
                accessibilityLiveRegion="polite"
              >
                {hours}
              </Text>
              <Pressable
                onPress={inc}
                style={({ pressed }) => [
                  styles.stepBtn,
                  { opacity: pressed ? 0.75 : 1 },
                  mindPressableWeb,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Increase hours slept"
              >
                <Text style={styles.stepGlyph}>+</Text>
              </Pressable>
            </View>
          </View>

          <Text style={[styles.gridLabel, mindTextNoSelectWeb]}>
            Sleep quality
          </Text>
          <View style={styles.grid}>
            {SLEEP_QUALITY_OPTIONS.map((opt) => {
              const selected = qualityId === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setQualityId(opt.id)}
                  style={({ pressed }) => [
                    styles.qualityCard,
                    cardShadow,
                    selected && styles.qualityCardSelected,
                    pressed && !selected && { opacity: 0.92 },
                    mindPressableWeb,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={opt.label}
                >
                  <Text style={styles.qualityEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.qualityTxt,
                      mindTextNoSelectWeb,
                      selected && styles.qualityTxtSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <MindPurpleButton
            title="Done ✨"
            backgroundColor={mindTheme.sleepDoneBlue}
            disabled={qualityId == null}
            onPress={() => {
              addXp(15);
              router.replace('/mind');
            }}
            style={styles.doneBtn}
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
  header: { alignItems: 'center', marginTop: 4 },
  moon: { fontSize: 48 },
  title: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: '800',
    color: mindTheme.text,
    textAlign: 'center',
  },
  audio: { marginTop: 16 },
  hoursCard: {
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: mindTheme.radiusLg,
    paddingVertical: 22,
    paddingHorizontal: mindTheme.gapLg,
  },
  sectionLabel: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: mindTheme.sleepCardTextMuted,
    marginBottom: 18,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: mindTheme.radiusSm,
    borderWidth: 1.5,
    borderColor: mindTheme.sleepStepperBorder,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepGlyph: {
    fontSize: 26,
    fontWeight: '600',
    color: mindTheme.textSecondary,
  },
  hoursValue: {
    fontSize: 44,
    fontWeight: '800',
    color: mindTheme.sleepHoursGreen,
    minWidth: 56,
    textAlign: 'center',
  },
  gridLabel: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '600',
    color: mindTheme.sleepCardTextMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  qualityCard: {
    width: '48%',
    maxWidth: 200,
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: mindTheme.radiusLg,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  qualityCardSelected: {
    backgroundColor: mindTheme.sleepCardSelectedBg,
    borderColor: mindTheme.sleepCardSelectedBorder,
  },
  qualityEmoji: { fontSize: 36 },
  qualityTxt: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
    color: mindTheme.sleepCardTextMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  qualityTxtSelected: {
    color: mindTheme.sleepHoursGreen,
  },
  doneBtn: {
    marginTop: 32,
    width: '100%',
  },
});

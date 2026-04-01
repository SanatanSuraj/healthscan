import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  mindTheme,
  MindBackLink,
  MindHealthToolCard,
  MindAudioButton,
  MindSosDashCard,
  mindPressableWeb,
  mindTextNoSelectWeb,
} from '@healthscan/ui';
import { useMindCareProgressStore } from '@/lib/mindCareProgressStore';
import { goBackOrReplace } from '@/lib/navigation';

const statShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 4,
};

export default function MindCareDashboard() {
  const streak = useMindCareProgressStore((s) => s.streak);
  const xp = useMindCareProgressStore((s) => s.xp);
  const level = useMindCareProgressStore((s) => s.level);
  const soundOn = useMindCareProgressStore((s) => s.soundOn);
  const preferHindiUi = useMindCareProgressStore((s) => s.preferHindiUi);
  const setSoundOn = useMindCareProgressStore((s) => s.setSoundOn);
  const toggleLangHint = useMindCareProgressStore((s) => s.toggleLangHint);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[
          mindTheme.dashboardBgTop,
          mindTheme.dashboardBgMid,
          mindTheme.dashboardBgBottom,
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MindBackLink onPress={() => goBackOrReplace('/(tabs)')} />
          <View style={styles.topRow}>
            <View style={styles.brand}>
              <Text style={styles.brainIco} accessibilityLabel="">
                🧠
              </Text>
              <View>
                <Text style={[styles.brandTitle, mindTextNoSelectWeb]}>
                  MindCare
                </Text>
                <Text style={[styles.brandBy, mindTextNoSelectWeb]}>
                  BY MOBILAB
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => setSoundOn(!soundOn)}
                style={({ pressed }) => [
                  styles.iconCircle,
                  { opacity: pressed ? 0.88 : 1 },
                  mindPressableWeb,
                ]}
                accessibilityRole="button"
                accessibilityLabel={soundOn ? 'Mute sounds' : 'Unmute sounds'}
              >
                <Text style={styles.iconGlyph}>{soundOn ? '🔊' : '🔇'}</Text>
              </Pressable>
              <Pressable
                onPress={toggleLangHint}
                style={({ pressed }) => [
                  styles.iconCircle,
                  { opacity: pressed ? 0.88 : 1 },
                  mindPressableWeb,
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  preferHindiUi ? 'Switch language hint to English' : 'Switch language hint to Hindi'
                }
              >
                <Text style={styles.langGlyph}>
                  {preferHindiUi ? 'EN' : 'हि'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.statsCard, statShadow]}>
            <View style={styles.statCol}>
              <Text style={styles.statIco}>🔥</Text>
              <Text style={[styles.statNum, { color: mindTheme.streakOrange }]}>
                {streak}
              </Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statIco}>⭐</Text>
              <Text style={[styles.statNum, { color: mindTheme.dashboardXp }]}>
                {xp}
              </Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <View style={styles.levelRing}>
                <Text style={styles.levelNum}>{level}</Text>
              </View>
              <Text style={[styles.statLabel, { marginTop: 6 }]}>Level</Text>
            </View>
          </View>

          <LinearGradient
            colors={[mindTheme.welcomePink, mindTheme.welcomeLavender]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCard}
          >
            <View style={styles.welcomeAudio}>
              <MindAudioButton />
            </View>
            <Text style={[styles.welcomeTitle, mindTextNoSelectWeb]}>
              Welcome 👋
            </Text>
            <Text style={[styles.welcomeSub, mindTextNoSelectWeb]}>
              Your daily wellness companion.
            </Text>
          </LinearGradient>

          <Text style={[styles.sectionTitle, mindTextNoSelectWeb]}>
            Today&apos;s Activities
          </Text>

          <MindHealthToolCard
            icon="😊"
            title="Mood Check-in"
            subtitle="How are you feeling?"
            badge="+10 XP"
            backgroundColor={mindTheme.dashYellowBg}
            titleColor={mindTheme.dashYellowTitle}
            subtitleColor={mindTheme.dashYellowSub}
            badgeBg={mindTheme.dashYellowBadgeBg}
            badgeTextColor={mindTheme.dashYellowBadgeText}
            onPress={() => router.push('/mind/mood')}
          />

          <MindHealthToolCard
            icon="🩺"
            title="Quick Health Check"
            subtitle="PHQ-9, GAD-7, PSS-10"
            badge="+30 XP"
            backgroundColor={mindTheme.dashBlueBg}
            titleColor={mindTheme.dashBlueTitle}
            subtitleColor={mindTheme.dashBlueSub}
            badgeBg={mindTheme.dashBlueBadgeBg}
            badgeTextColor={mindTheme.dashBlueBadgeText}
            onPress={() => router.push('/mind/quick-health')}
          />

          <MindHealthToolCard
            icon="🌊"
            title="Breathing Exercise"
            subtitle="4-7-8 calm technique"
            badge="+20 XP"
            backgroundColor={mindTheme.dashGreenBg}
            titleColor={mindTheme.dashGreenTitle}
            subtitleColor={mindTheme.dashGreenSub}
            badgeBg={mindTheme.dashGreenBadgeBg}
            badgeTextColor={mindTheme.dashGreenBadgeText}
            onPress={() => router.push('/mind/breathing')}
          />

          <MindHealthToolCard
            icon="🌙"
            title="Sleep Check-in"
            subtitle="How did you sleep?"
            badge="+15 XP"
            backgroundColor={mindTheme.dashPurpleBg}
            titleColor={mindTheme.dashPurpleTitle}
            subtitleColor={mindTheme.dashPurpleSub}
            badgeBg={mindTheme.dashPurpleBadgeBg}
            badgeTextColor={mindTheme.dashPurpleBadgeText}
            onPress={() => router.push('/mind/sleep')}
          />

          <MindSosDashCard onPress={() => router.push('/mind/sos')} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: mindTheme.gapLg,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  brainIco: { fontSize: 36 },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: mindTheme.text,
  },
  brandBy: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: mindTheme.dashboardHeaderMeta,
    marginTop: 2,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: mindTheme.headerIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: { fontSize: 18 },
  langGlyph: {
    fontSize: 16,
    fontWeight: '800',
    color: mindTheme.dashBlueTitle,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: mindTheme.radiusLg,
    paddingVertical: mindTheme.gapLg,
    paddingHorizontal: 12,
    marginBottom: mindTheme.gapLg,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statIco: { fontSize: 22, marginBottom: 4 },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: mindTheme.textSecondary,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth * 2,
    height: 44,
    backgroundColor: mindTheme.dashboardStatDivider,
  },
  levelRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: mindTheme.levelRing,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNum: {
    fontSize: 18,
    fontWeight: '800',
    color: mindTheme.text,
  },
  welcomeCard: {
    borderRadius: mindTheme.radiusLg,
    paddingVertical: 22,
    paddingHorizontal: mindTheme.gapLg,
    alignItems: 'center',
    marginBottom: mindTheme.gapLg,
    ...statShadow,
  },
  welcomeAudio: { marginBottom: 10 },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: mindTheme.text,
    textAlign: 'center',
  },
  welcomeSub: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: mindTheme.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: mindTheme.text,
    marginBottom: mindTheme.gapMd,
  },
});

import React, { useMemo } from 'react';
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
  mindTextNoSelectWeb,
  mindPressableWeb,
} from '@healthscan/ui';
import { goBackOrReplace } from '@/lib/navigation';
import { PSS10_ITEMS, pss10StressLabel, pss10TotalFromRaw } from '@/lib/mindScreeningContent';
import { useMindScreeningStore } from '@/lib/mindScreeningStore';

export default function Pss10DoneScreen() {
  const raw = useMindScreeningStore((s) => s.pss10RawScores);
  const clearPss10 = useMindScreeningStore((s) => s.clearPss10);

  const { total, label } = useMemo(() => {
    if (!raw || raw.length !== PSS10_ITEMS.length) {
      return { total: null as number | null, label: null as string | null };
    }
    const t = pss10TotalFromRaw(raw);
    if (Number.isNaN(t)) {
      return { total: null, label: null };
    }
    return { total: t, label: pss10StressLabel(t) };
  }, [raw]);

  return (
    <MindScreenBackdrop variant="pss10">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <MindBackLink onPress={() => goBackOrReplace('/mind')} />
          <Text style={styles.bolt} accessibilityLabel="Complete">
            ⚡
          </Text>
          <Text style={[styles.completeTitle, mindTextNoSelectWeb]}>
            Complete!
          </Text>

          {total != null && label ? (
            <View style={styles.scoreCard}>
              <Text style={[styles.scoreNum, mindTextNoSelectWeb]}>
                {total}/40
              </Text>
              <Text style={[styles.scoreLabel, mindTextNoSelectWeb]}>
                {label}
              </Text>
            </View>
          ) : (
            <Text style={styles.missing}>
              No score found. Start the check from Quick Health Check.
            </Text>
          )}

          <View style={styles.audio}>
            <MindAudioButton />
          </View>

          <View style={styles.recCard}>
            <Text style={[styles.recHead, mindTextNoSelectWeb]}>
              💡 Recommended
            </Text>
            <Text style={[styles.recBody, mindTextNoSelectWeb]}>
              Consider your EAP: 1to1Help, YourDOST, Amaha
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Support"
              onPress={() => router.replace('/mind')}
              style={({ pressed }) => [
                styles.supportBtn,
                { opacity: pressed ? 0.92 : 1 },
                mindPressableWeb,
              ]}
            >
              <Text style={styles.sosIco}>🆘</Text>
              <Text style={styles.supportTxt}>Support</Text>
            </Pressable>
          </View>

          <View style={styles.xpCard}>
            <Text style={styles.xpStar}>⭐</Text>
            <Text style={[styles.xpTxt, mindTextNoSelectWeb]}>+30 XP</Text>
          </View>

          <MindPurpleButton
            title="Home 🏠"
            backgroundColor={mindTheme.gadHomeBlue}
            onPress={() => {
              clearPss10();
              router.replace('/(tabs)');
            }}
            style={styles.homeBtn}
          />
        </ScrollView>
      </SafeAreaView>
    </MindScreenBackdrop>
  );
}

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
    alignItems: 'center',
  },
  bolt: {
    fontSize: 44,
    marginTop: 8,
    textAlign: 'center',
  },
  completeTitle: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: '800',
    color: mindTheme.text,
    textAlign: 'center',
  },
  scoreCard: {
    marginTop: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: mindTheme.radiusLg,
    borderWidth: 2,
    borderColor: mindTheme.gadResultBorder,
    backgroundColor: '#FFFBEB',
    ...cardShadow,
  },
  scoreNum: {
    fontSize: 36,
    fontWeight: '800',
    color: mindTheme.gadResultScore,
  },
  scoreLabel: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    color: mindTheme.gadResultScore,
  },
  missing: {
    marginTop: 16,
    fontSize: 15,
    color: mindTheme.textSecondary,
    textAlign: 'center',
  },
  audio: { marginTop: 20, marginBottom: 8 },
  recCard: {
    marginTop: 12,
    width: '100%',
    maxWidth: 340,
    padding: mindTheme.gapLg,
    borderRadius: mindTheme.radiusLg,
    backgroundColor: mindTheme.gadRecBg,
    ...cardShadow,
  },
  recHead: {
    fontSize: 17,
    fontWeight: '800',
    color: mindTheme.gadRecTitle,
  },
  recBody: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: mindTheme.gadRecBody,
    lineHeight: 22,
  },
  supportBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: mindTheme.gadSupportRed,
    borderRadius: mindTheme.radiusPill,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  sosIco: { fontSize: 18 },
  supportTxt: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  xpCard: {
    marginTop: mindTheme.gapLg,
    width: '100%',
    maxWidth: 340,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: mindTheme.radiusLg,
    backgroundColor: '#FFFFFF',
    ...cardShadow,
  },
  xpStar: { fontSize: 22 },
  xpTxt: {
    fontSize: 18,
    fontWeight: '800',
    color: mindTheme.gadXpPurple,
  },
  homeBtn: {
    width: '100%',
    maxWidth: 340,
    marginTop: mindTheme.gapLg,
  },
});

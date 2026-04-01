import React, { useEffect, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { useMindCareProgressStore } from '@/lib/mindCareProgressStore';

const PHASES = [
  { label: 'Breathe In', seconds: 4 },
  { label: 'Hold', seconds: 7 },
  { label: 'Breathe Out', seconds: 8 },
] as const;

const TOTAL_CYCLES = 3;

type BreathState =
  | { screen: 'intro' }
  | {
      screen: 'active';
      cycleIndex: number;
      phaseIndex: number;
      remaining: number;
    }
  | { screen: 'complete' };

type Action =
  | { type: 'start' }
  | { type: 'tick' }
  | { type: 'to_intro' };

function tickActive(
  s: Extract<BreathState, { screen: 'active' }>,
): BreathState {
  if (s.remaining > 1) {
    return { ...s, remaining: s.remaining - 1 };
  }
  const nextPhase = s.phaseIndex + 1;
  if (nextPhase < PHASES.length) {
    return {
      ...s,
      phaseIndex: nextPhase,
      remaining: PHASES[nextPhase].seconds,
    };
  }
  const nextCycle = s.cycleIndex + 1;
  if (nextCycle < TOTAL_CYCLES) {
    return {
      ...s,
      cycleIndex: nextCycle,
      phaseIndex: 0,
      remaining: PHASES[0].seconds,
    };
  }
  return { screen: 'complete' };
}

function reducer(state: BreathState, action: Action): BreathState {
  switch (action.type) {
    case 'start':
      return {
        screen: 'active',
        cycleIndex: 0,
        phaseIndex: 0,
        remaining: PHASES[0].seconds,
      };
    case 'tick':
      if (state.screen !== 'active') return state;
      return tickActive(state);
    case 'to_intro':
      return { screen: 'intro' };
    default:
      return state;
  }
}

export default function BreathingScreen() {
  const [state, dispatch] = useReducer(reducer, { screen: 'intro' } as BreathState);
  const addXp = useMindCareProgressStore((s) => s.addXp);

  const isActive = state.screen === 'active';

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, [isActive]);

  const cycleDisplay =
    state.screen === 'active'
      ? state.cycleIndex + 1
      : state.screen === 'complete'
        ? TOTAL_CYCLES
        : 1;

  const handleBack = () => {
    if (state.screen === 'intro') {
      router.back();
      return;
    }
    dispatch({ type: 'to_intro' });
  };

  const phaseAccent =
    state.screen === 'active' && state.phaseIndex === 2
      ? mindTheme.breathRingAlt
      : mindTheme.breathRing;

  return (
    <MindScreenBackdrop variant="breathing">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {state.screen === 'intro' ? (
          <ScrollView
            contentContainerStyle={styles.introScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <MindBackLink onPress={handleBack} />
            <View style={styles.headerCenter}>
              <Text style={[styles.title, mindTextNoSelectWeb]}>
                🌊 Breathing
              </Text>
              <Text style={[styles.sub, mindTextNoSelectWeb]}>
                4-7-8 · Cycle 1/3
              </Text>
            </View>
            <View style={styles.audioRow}>
              <MindAudioButton />
            </View>
            <LinearGradient
              colors={[mindTheme.breathMintStart, mindTheme.breathMintEnd]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.timingPill}
            >
              <Text style={[styles.timingTxt, mindTextNoSelectWeb]}>
                <Text style={styles.timingBold}>4s</Text> In →{' '}
                <Text style={styles.timingBold}>7s</Text> Hold →{' '}
                <Text style={styles.timingBold}>8s</Text> Out
              </Text>
            </LinearGradient>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start breathing exercise"
              onPress={() => dispatch({ type: 'start' })}
              style={({ pressed }) => [
                { opacity: pressed ? 0.94 : 1 },
                mindPressableWeb,
              ]}
            >
              <LinearGradient
                colors={[mindTheme.breathTealStart, mindTheme.breathTealEnd]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.startBtn}
              >
                <Text style={styles.startBtnTxt}>Start 🌬️</Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        ) : null}

        {state.screen === 'active' ? (
          <View style={styles.activeWrap}>
            <MindBackLink onPress={handleBack} />
            <View style={styles.headerCenter}>
              <Text style={[styles.title, mindTextNoSelectWeb]}>
                🌊 Breathing
              </Text>
              <Text style={[styles.sub, mindTextNoSelectWeb]}>
                4-7-8 · Cycle {cycleDisplay}/{TOTAL_CYCLES}
              </Text>
            </View>
            <View style={styles.audioRow}>
              <MindAudioButton />
            </View>
            <View style={styles.circleWrap}>
              <View
                style={[
                  styles.circle,
                  {
                    borderColor: phaseAccent,
                    backgroundColor: mindTheme.breathRingFill,
                  },
                ]}
              >
                <Text style={[styles.countNum, { color: phaseAccent }]}>
                  {state.remaining}
                </Text>
                <Text style={[styles.phaseLabel, { color: phaseAccent }]}>
                  {PHASES[state.phaseIndex].label}
                </Text>
              </View>
            </View>
            <View style={styles.dots}>
              {PHASES.map((_, i) => (
                <View
                  key={PHASES[i].label}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        i === state.phaseIndex
                          ? phaseAccent
                          : i < state.phaseIndex
                            ? mindTheme.breathRing
                            : mindTheme.breathDotMuted,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}

        {state.screen === 'complete' ? (
          <ScrollView
            contentContainerStyle={styles.completeScroll}
            showsVerticalScrollIndicator={false}
          >
            <MindBackLink onPress={handleBack} />
            <View style={styles.headerCenter}>
              <Text style={[styles.title, mindTextNoSelectWeb]}>
                🌊 Breathing
              </Text>
              <Text style={[styles.sub, mindTextNoSelectWeb]}>
                4-7-8 · Cycle {TOTAL_CYCLES}/{TOTAL_CYCLES}
              </Text>
            </View>
            <Text style={styles.celebrate}>🎉</Text>
            <Text
              style={[styles.completeHeading, mindTextNoSelectWeb]}
            >
              Complete!
            </Text>
            <Text style={[styles.xpLine, mindTextNoSelectWeb]}>
              ⭐ +20 XP
            </Text>
            <View style={styles.audioRow}>
              <MindAudioButton />
            </View>
            <MindPurpleButton
              title="Home 🏠"
              backgroundColor={mindTheme.gadHomeBlue}
              onPress={() => {
                addXp(20);
                router.replace('/mind');
              }}
              style={styles.homeBtn}
            />
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </MindScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  introScroll: {
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
  },
  activeWrap: {
    flex: 1,
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
  },
  completeScroll: {
    paddingHorizontal: mindTheme.screenPad,
    paddingBottom: mindTheme.screenPadBottom,
    alignItems: 'center',
  },
  headerCenter: { alignItems: 'center', marginTop: 8 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: mindTheme.text,
  },
  sub: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    color: mindTheme.textMuted,
  },
  audioRow: { alignItems: 'center', marginTop: 20, marginBottom: 8 },
  timingPill: {
    marginTop: 20,
    borderRadius: mindTheme.radiusPill,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  timingTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: mindTheme.text,
    textAlign: 'center',
  },
  timingBold: { fontWeight: '800' },
  startBtn: {
    marginTop: 28,
    borderRadius: mindTheme.radiusPill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startBtnTxt: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  circleWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 280,
  },
  circle: {
    width: 248,
    height: 248,
    borderRadius: 124,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNum: {
    fontSize: 64,
    fontWeight: '800',
  },
  phaseLabel: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  celebrate: {
    fontSize: 64,
    marginTop: 24,
    textAlign: 'center',
  },
  completeHeading: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '800',
    color: mindTheme.breathCompleteText,
  },
  xpLine: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '800',
    color: mindTheme.breathCompleteText,
  },
  homeBtn: {
    marginTop: 28,
    width: '100%',
    maxWidth: 340,
  },
});

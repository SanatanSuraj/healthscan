import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth';
import { theme, Button, MedicalDisclaimer } from '@healthscan/ui';
import {
  generateCptSequence,
  reactionTrialValid,
  stressScoreFromLikert,
  PSS_LIKE_QUESTIONS,
} from '@healthscan/test-engine';

type Step = 'prep' | 'memory' | 'attention' | 'reaction' | 'stress';

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function MindModuleScreen() {
  const { api } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('prep');
  const [err, setErr] = useState('');
  const [memoryRound, setMemoryRound] = useState(0);
  const [memorySeq, setMemorySeq] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);

  const [cptI, setCptI] = useState(0);
  const cptRef = useRef<boolean[]>([]);
  const [cptHits, setCptHits] = useState(0);
  const [cptMiss, setCptMiss] = useState(0);
  const [cptFa, setCptFa] = useState(0);

  const [rtI, setRtI] = useState(0);
  const rtStarted = useRef<number | null>(null);
  const rtTimes = useRef<number[]>([]);

  const [stressAnswers, setStressAnswers] = useState<number[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const s = (await api.sessions.create({
          module: 'mind',
          device: {
            os: Platform.OS,
            dpr: PixelRatio.get(),
            input: Platform.OS === 'web' ? 'mouse' : 'touch',
          },
          clientBatchId: randomId(),
        })) as { _id: string };
        setSessionId(s._id);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : 'Could not start session');
      }
    })();
  }, [api]);

  const runMemoryRound = useCallback(() => {
    const next = [
      1 + Math.floor(Math.random() * 9),
      1 + Math.floor(Math.random() * 9),
      1 + Math.floor(Math.random() * 9),
    ];
    setMemorySeq(next);
    setUserSeq([]);
    setMemoryRound((r) => r + 1);
    setStep('memory');
  }, []);

  const startAttention = useCallback(() => {
    cptRef.current = generateCptSequence(24, 0.28);
    setCptI(0);
    setCptHits(0);
    setCptMiss(0);
    setCptFa(0);
    setStep('attention');
  }, []);

  useEffect(() => {
    if (step !== 'reaction') return;
    const delay = 400 + Math.random() * 900;
    const t = setTimeout(() => {
      rtStarted.current = globalThis.performance.now();
    }, delay);
    return () => clearTimeout(t);
  }, [step, rtI]);

  const finishAndSubmit = async () => {
    if (!sessionId) return;
    const denom = cptHits + cptMiss + cptFa || 1;
    const accuracy = (cptHits / denom) * 100;
    const valid = rtTimes.current.filter(reactionTrialValid);
    const meanMs =
      valid.length > 0
        ? valid.reduce((a, b) => a + b, 0) / valid.length
        : 350;

    const mind = {
      memory: {
        maxSpan: Math.max(memorySeq.length, 3),
        roundsCorrect: memoryRound,
      },
      attention: {
        accuracy,
        missedTargets: cptMiss,
        falseAlarms: cptFa,
      },
      reaction: { meanMs, trials: valid.length },
      stress: {
        likertTotal: stressAnswers.reduce((a, b) => a + b, 0),
        questionCount: stressAnswers.length || 1,
      },
    };

    try {
      const res = (await api.sessions.submit(
        sessionId,
        { mind },
        randomId(),
      )) as { _id: string };
      void api.analytics.track([
        { event: 'test_complete', props: { module: 'mind' } },
      ]);
      router.replace(`/result/${res._id}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Submit failed');
    }
  };

  if (err && !sessionId) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{err}</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  if (!sessionId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.sub}>Preparing session…</Text>
      </View>
    );
  }

  if (step === 'prep') {
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Mind screening</Text>
        <Text style={styles.p}>
          Find a quiet spot. Timed tasks require a stable connection.
        </Text>
        <Button title="Begin" onPress={runMemoryRound} />
        <MedicalDisclaimer />
      </View>
    );
  }

  if (step === 'memory') {
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Memory</Text>
        <Text style={styles.p}>Remember this sequence:</Text>
        <Text style={styles.seq}>{memorySeq.join(' · ')}</Text>
        <Text style={styles.p}>Tap the digits in order.</Text>
        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <Pressable
              key={n}
              style={styles.cell}
              onPress={() => {
                const next = [...userSeq, n];
                setUserSeq(next);
                if (next.length < memorySeq.length) return;
                const ok = next.every((v, i) => v === memorySeq[i]);
                if (ok && memoryRound < 4) {
                  runMemoryRound();
                } else {
                  startAttention();
                }
              }}
            >
              <Text style={styles.cellTxt}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  if (step === 'attention') {
    const isT = cptRef.current[cptI];
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Attention</Text>
        <Text style={styles.p}>Tap only when you see a green target label.</Text>
        <Pressable
          style={[
            styles.stimulus,
            {
              backgroundColor: isT
                ? theme.colors.secondary
                : theme.colors.border,
            },
          ]}
          onPress={() => {
            if (!isT) setCptFa((x) => x + 1);
            else setCptHits((x) => x + 1);
            if (cptI + 1 >= cptRef.current.length) {
              setRtI(0);
              rtTimes.current = [];
              rtStarted.current = null;
              setStep('reaction');
            } else setCptI((i) => i + 1);
          }}
        >
          <Text style={{ color: theme.colors.surface, fontSize: 22 }}>
            {isT ? 'TARGET' : 'ignore'}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (step === 'reaction') {
    return (
      <Pressable
        style={styles.full}
        onPress={() => {
          const start = rtStarted.current;
          if (start == null) return;
          const ms = globalThis.performance.now() - start;
          rtTimes.current.push(ms);
          if (rtTimes.current.length >= 12) {
            setStressAnswers([]);
            setStep('stress');
            return;
          }
          rtStarted.current = null;
          setRtI((i) => i + 1);
        }}
      >
        <Text style={styles.centerTxt}>
          Tap as soon as the white flash appears
        </Text>
        {rtStarted.current != null ? <View style={styles.flash} /> : null}
      </Pressable>
    );
  }

  if (step === 'stress') {
    const idx = stressAnswers.length;
    if (idx >= PSS_LIKE_QUESTIONS.length) {
      return (
        <View style={styles.pad}>
          <Text style={styles.h}>Review</Text>
          <Text style={styles.p}>
            Self-reported stress index (screening only):{' '}
            {stressScoreFromLikert(stressAnswers)}
          </Text>
          {err ? <Text style={styles.err}>{err}</Text> : null}
          <Button title="Save results" onPress={finishAndSubmit} />
        </View>
      );
    }
    const q = PSS_LIKE_QUESTIONS[idx] ?? '';
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Stress check-in</Text>
        <Text style={styles.p}>{q}</Text>
        <Text style={styles.p}>0 = never, 4 = very often</Text>
        <View style={styles.grid}>
          {[0, 1, 2, 3, 4].map((v) => (
            <Pressable
              key={v}
              style={styles.cell}
              onPress={() => setStressAnswers((a) => [...a, v])}
            >
              <Text style={styles.cellTxt}>{v}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  pad: { flex: 1, padding: theme.space.lg, backgroundColor: theme.colors.bg },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.space.lg,
  },
  h: { fontSize: theme.type.lg, fontWeight: '700', color: theme.colors.text },
  p: {
    marginTop: theme.space.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  sub: { marginTop: theme.space.sm, color: theme.colors.textSecondary },
  seq: {
    marginTop: theme.space.md,
    fontSize: theme.type.xl,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.space.lg },
  cell: {
    width: '28%',
    margin: '2%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cellTxt: { fontSize: theme.type.xl, fontWeight: '600' },
  stimulus: {
    marginTop: theme.space.xl,
    height: 200,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { flex: 1, backgroundColor: theme.colors.text, justifyContent: 'center' },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    opacity: 0.95,
  },
  centerTxt: {
    textAlign: 'center',
    color: theme.colors.surface,
    fontSize: theme.type.lg,
    padding: theme.space.lg,
  },
  err: {
    color: theme.colors.riskRed,
    textAlign: 'center',
    marginBottom: theme.space.md,
  },
});

import React, { useState } from 'react';
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
import {
  theme,
  Button,
  CalibrationCard,
  MedicalDisclaimer,
} from '@healthscan/ui';
import { pixelsPerMm } from '@healthscan/test-engine';

type Step =
  | 'prep'
  | 'calibrate'
  | 'acuity'
  | 'color'
  | 'astigmatism'
  | 'contrast'
  | 'review';

const LETTERS = ['E', 'F', 'P', 'T', 'O', 'Z', 'L', 'D'];

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function EyeModuleScreen() {
  const { api } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('prep');
  const [err, setErr] = useState('');
  const [cardPx, setCardPx] = useState('');
  const [starting, setStarting] = useState(false);

  const [acuityRow, setAcuityRow] = useState(0);
  const [acuityCorrect, setAcuityCorrect] = useState(0);

  const [colorPlate, setColorPlate] = useState(0);
  const [colorAnswer, setColorAnswer] = useState<string[]>([]);

  const [astigSuspected, setAstigSuspected] = useState(false);

  const [contrastLevel, setContrastLevel] = useState(3);
  const [contrastMax] = useState(8);

  async function startCalibratedSession() {
    setErr('');
    setStarting(true);
    try {
      const w = Number(cardPx);
      const ppmm = w > 0 ? pixelsPerMm(w) : undefined;
      const s = (await api.sessions.create({
        module: 'eye',
        device: {
          os: Platform.OS,
          dpr: PixelRatio.get(),
          input: Platform.OS === 'web' ? 'mouse' : 'touch',
        },
        calibration: {
          cardWidthPx: w,
          ppmm,
          method: 'creditCard',
        },
        clientBatchId: randomId(),
      })) as { _id: string };
      setSessionId(s._id);
      setStep('acuity');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Could not start session');
    } finally {
      setStarting(false);
    }
  }

  const submit = async () => {
    if (!sessionId) return;
    const eye = {
      acuity: {
        rowsCorrect: acuityCorrect,
        rowsTotal: 4,
      },
      color: {
        diagnosis:
          colorAnswer[0] === '12' && colorAnswer[1] === '8'
            ? 'normal'
            : 'abnormal_self_reported',
      },
      astigmatism: { suspected: astigSuspected },
      contrast: { level: contrastLevel, maxLevel: contrastMax },
    };
    try {
      const res = (await api.sessions.submit(sessionId, { eye }, randomId())) as {
        _id: string;
      };
      void api.analytics.track([
        { event: 'test_complete', props: { module: 'eye' } },
      ]);
      router.replace(`/result/${res._id}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Submit failed');
    }
  };

  if (step === 'prep') {
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Vision screening</Text>
        <Text style={styles.p}>
          Results depend on your screen and viewing distance — not a clinical
          exam.
        </Text>
        <Button title="Continue" onPress={() => setStep('calibrate')} />
        <MedicalDisclaimer />
      </View>
    );
  }

  if (step === 'calibrate') {
    return (
      <View style={styles.pad}>
        <CalibrationCard cardWidthPx={cardPx} onChangeWidth={setCardPx} />
        <View style={{ height: theme.space.md }} />
        {err ? <Text style={styles.err}>{err}</Text> : null}
        <Button
          title={starting ? 'Starting…' : 'Start tests'}
          disabled={Number(cardPx) <= 10 || starting}
          onPress={startCalibratedSession}
        />
      </View>
    );
  }

  if (!sessionId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (step === 'acuity') {
    const target = LETTERS[(acuityRow + 2) % LETTERS.length];
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Visual acuity (simplified)</Text>
        <Text style={styles.p}>Hold ~40cm distance. Which letter matches?</Text>
        <Text style={styles.bigLetter}>{target}</Text>
        <View style={styles.grid}>
          {LETTERS.map((L) => (
            <Pressable
              key={L}
              style={styles.cell}
              onPress={() => {
                const ok = L === target;
                if (ok) setAcuityCorrect((c) => c + 1);
                if (acuityRow + 1 >= 4) setStep('color');
                else setAcuityRow((r) => r + 1);
              }}
            >
              <Text style={styles.cellTxt}>{L}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  if (step === 'color') {
    const plates = [
      { options: ['12', '13', 'nothing'] },
      { options: ['8', '3', 'nothing'] },
    ];
    const plate = plates[colorPlate];
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Color perception</Text>
        <Text style={styles.p}>What do you see most clearly?</Text>
        {plate.options.map((o) => (
          <React.Fragment key={o}>
            <View style={{ height: theme.space.sm }} />
            <Button
              title={o}
              variant={o === 'nothing' ? 'secondary' : 'primary'}
              onPress={() => {
                setColorAnswer((a) => [...a, o]);
                if (colorPlate + 1 >= plates.length) setStep('astigmatism');
                else setColorPlate((p) => p + 1);
              }}
            />
          </React.Fragment>
        ))}
      </View>
    );
  }

  if (step === 'astigmatism') {
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Astigmatism cue</Text>
        <Text style={styles.p}>
          Do some radial lines or clock spokes look sharper than others?
        </Text>
        <Button title="No — fairly even" onPress={() => setStep('contrast')} />
        <View style={{ height: theme.space.sm }} />
        <Button
          title="Yes — uneven"
          variant="secondary"
          onPress={() => {
            setAstigSuspected(true);
            setStep('contrast');
          }}
        />
      </View>
    );
  }

  if (step === 'contrast') {
    const vis = 0.25 + (contrastLevel / contrastMax) * 0.75;
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Contrast</Text>
        <Text style={styles.p}>Increase steps until stripes are easy to see.</Text>
        <View
          style={[
            styles.contrastBox,
            { opacity: vis, backgroundColor: theme.colors.text },
          ]}
        />
        <Button
          title="Increase clarity"
          onPress={() => setContrastLevel((l) => Math.min(contrastMax, l + 1))}
        />
        <View style={{ height: theme.space.sm }} />
        <Button
          title="Continue"
          variant="secondary"
          onPress={() => setStep('review')}
        />
      </View>
    );
  }

  if (step === 'review') {
    return (
      <View style={styles.pad}>
        <Text style={styles.h}>Review</Text>
        <Text style={styles.p}>Save approximate vision screening results.</Text>
        {err ? <Text style={styles.err}>{err}</Text> : null}
        <Button title="Save" onPress={submit} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  pad: { flex: 1, padding: theme.space.lg, backgroundColor: theme.colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  h: { fontSize: theme.type.lg, fontWeight: '700', color: theme.colors.text },
  p: {
    marginTop: theme.space.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  bigLetter: {
    fontSize: 72,
    fontWeight: '200',
    textAlign: 'center',
    marginVertical: theme.space.lg,
    color: theme.colors.text,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: '22%',
    margin: '1.5%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cellTxt: { fontSize: theme.type.lg, fontWeight: '600' },
  contrastBox: {
    height: 100,
    marginVertical: theme.space.lg,
    borderRadius: theme.radius.md,
  },
  err: { color: theme.colors.riskRed, marginBottom: theme.space.md },
});

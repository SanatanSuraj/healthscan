import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeOutlineButton,
  EyePrimaryButton,
} from '@healthscan/ui';
import { useEyeScreeningStore } from '@/lib/eyeScreeningStore';
import { COLOR_PLATES } from '@/lib/eyeScreeningContent';
import {
  computeRiskTier,
  parseSnellenDenom,
  nearAcuityLabel,
} from '@/lib/eyeScreeningScoring';

export default function ScreeningResultsScreen() {
  const patient = useEyeScreeningStore((s) => s.patient);
  const va = useEyeScreeningStore((s) => s.visualAcuity);
  const nearN = useEyeScreeningStore((s) => s.nearVisionN);
  const colorResults = useEyeScreeningStore((s) => s.colorResults);
  const contrast = useEyeScreeningStore((s) => s.contrastFinal);
  const amsler = useEyeScreeningStore((s) => s.amsler);
  const symptoms = useEyeScreeningStore((s) => s.symptoms);
  const resetSession = useEyeScreeningStore((s) => s.resetSession);

  const colorCorrect = colorResults.filter(
    (r) => r.selected === r.correctDigit,
  ).length;
  const colorTotal = COLOR_PLATES.length;
  const colorSuspected = colorCorrect / colorTotal < 0.6;

  const posSymptoms = symptoms.filter((x) => x === true).length;

  const worstDenom = useMemo(() => {
    const od = va.od?.snellenLabel ?? '20/40';
    const os = va.os?.snellenLabel ?? '20/40';
    return Math.max(parseSnellenDenom(od), parseSnellenDenom(os));
  }, [va]);

  const tier = useMemo(
    () =>
      computeRiskTier({
        worstSnellenDenom: worstDenom,
        colorWrong: colorTotal - colorCorrect,
        colorTotal,
        amslerTotal: amsler.od.length + amsler.os.length,
        positiveSymptoms: posSymptoms,
      }),
    [worstDenom, colorTotal, colorCorrect, amsler, posSymptoms],
  );

  const alertTitle =
    tier === 'high'
      ? 'High Risk — Urgent referral required'
      : tier === 'moderate'
        ? 'Moderate Risk — Schedule ophthalmology review'
        : 'Low Risk — Routine follow-up';

  const facility = 'Tertiary Eye Hospital';
  const urgency =
    tier === 'high'
      ? 'Within 48 hours / 48 घंटे के भीतर'
      : tier === 'moderate'
        ? 'Within 2–4 weeks / 2–4 सप्ताह के भीतर'
        : 'As needed / आवश्यकतानुसार';

  const when = new Date();
  const dateStr = when.toLocaleDateString();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Screening Results</Text>

        <View style={styles.patientCard}>
          <Text style={styles.patientLine}>
            {patient.fullName || 'Patient'} • {patient.age || '—'} yrs •{' '}
            {patient.sex || '—'}
          </Text>
          <Text style={styles.metaLine}>
            {patient.village || '—'} • {dateStr}
          </Text>
          <View
            style={[
              styles.alert,
              tier !== 'high' && styles.alertMod,
              tier === 'low' && styles.alertLow,
            ]}
          >
            <Text style={styles.alertIcon}>🚨</Text>
            <Text
              style={[
                styles.alertTxt,
                tier !== 'high' && styles.alertTxtMod,
                tier === 'low' && styles.alertTxtLow,
              ]}
            >
              {alertTitle}
            </Text>
          </View>
        </View>

        <ResultCard icon="👁️" title="Visual Acuity">
          <Row
            label="Right Eye (OD)"
            value={`${va.od?.snellenLabel ?? '—'} (${va.od?.logMAR ?? '—'} logMAR)`}
          />
          <Row
            label="Left Eye (OS)"
            value={`${va.os?.snellenLabel ?? '—'} (${va.os?.logMAR ?? '—'} logMAR)`}
          />
        </ResultCard>

        <ResultCard icon="📖" title="Near Vision">
          <Row label="Near Acuity" value={nearAcuityLabel(nearN)} bold />
        </ResultCard>

        <ResultCard icon="🌈" title="Color Vision">
          <Row
            label="Plates Correct"
            value={`${colorCorrect}/${colorTotal}`}
            bold
          />
          <Row
            label="Deficiency Suspected"
            value={colorSuspected ? 'Yes' : 'No'}
            bold
          />
        </ResultCard>

        <ResultCard icon="◑" title="Contrast Sensitivity">
          <Row label="logCS" value={contrast?.logCS ?? '—'} bold />
          <Row
            label="Level"
            value={
              contrast
                ? `${contrast.levelIndex + 1}/${9}`
                : '—'
            }
            bold
          />
        </ResultCard>

        <ResultCard icon="▦" title="Amsler Grid">
          <Row label="Distortions OD" value={String(amsler.od.length)} bold />
          <Row label="Distortions OS" value={String(amsler.os.length)} bold />
        </ResultCard>

        <ResultCard icon="📋" title="Symptom Questionnaire">
          <Row
            label="Positive Responses"
            value={`${posSymptoms}/10`}
            bold
          />
        </ResultCard>

        <View style={styles.refCard}>
          <Text style={styles.refTitle}>Referral Recommendation</Text>
          <Row label="Facility" value={facility} bold />
          <Row label="Urgency" value={urgency} bold />
        </View>

        <EyeOutlineButton
          title="📚 Eye Health Education"
          onPress={() => router.push('/screening/education')}
          style={styles.outlineBtn}
        />
        <EyeOutlineButton
          title="🖥 Doctor Dashboard"
          onPress={() => router.push('/screening/dashboard')}
          style={styles.outlineBtn}
        />
        <EyePrimaryButton
          title="＋ New Patient"
          onPress={() => {
            resetSession();
            router.replace('/screening');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLab}>{label}</Text>
      <Text style={[styles.rowVal, bold && styles.rowValBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  scroll: { padding: eyeTheme.screenPad, paddingBottom: 48 },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: eyeTheme.primary,
    marginBottom: 16,
  },
  patientCard: {
    backgroundColor: eyeTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  patientLine: {
    fontSize: 16,
    fontWeight: '600',
    color: eyeTheme.textDark,
    textAlign: 'center',
  },
  metaLine: {
    fontSize: 13,
    color: eyeTheme.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: eyeTheme.alertBorder,
    backgroundColor: eyeTheme.alertBg,
    width: '100%',
  },
  alertMod: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  alertLow: {
    borderColor: '#22C55E',
    backgroundColor: '#ECFDF3',
  },
  alertIcon: { fontSize: 18, marginRight: 8 },
  alertTxt: {
    flex: 1,
    fontWeight: '800',
    color: eyeTheme.alertText,
    fontSize: 14,
  },
  alertTxtMod: { color: '#B45309' },
  alertTxtLow: { color: '#15803D' },
  card: {
    backgroundColor: eyeTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    padding: 16,
    marginBottom: 14,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardIcon: { fontSize: 20, marginRight: 8 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: eyeTheme.primary },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: eyeTheme.border,
  },
  rowLab: { color: eyeTheme.textMuted, fontSize: 14, flex: 1 },
  rowVal: { color: eyeTheme.textSecondary, fontSize: 14, fontWeight: '600' },
  rowValBold: { color: eyeTheme.primary, fontWeight: '800' },
  refCard: {
    backgroundColor: eyeTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    padding: 16,
    marginBottom: 16,
  },
  refTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: eyeTheme.primary,
    marginBottom: 8,
  },
  outlineBtn: { marginBottom: 12 },
});

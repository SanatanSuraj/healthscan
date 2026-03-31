import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  eyeTheme,
  EyeScreenHeader,
  EyeLabeledField,
  EyeSelectField,
  EyeBinaryChoice,
  EyeSurfacePanel,
  EyePrimaryButton,
} from '@healthscan/ui';
import {
  useEyeScreeningStore,
  type HistoryField,
} from '@/lib/eyeScreeningStore';

const HISTORY_ROWS: { key: HistoryField; label: string }[] = [
  { key: 'diabetes', label: 'Diabetes History' },
  { key: 'hypertension', label: 'Hypertension' },
  { key: 'glasses', label: 'Current Glasses Use' },
  { key: 'cataract', label: 'Previous Cataract Surgery' },
];

export default function PatientDetailsScreen() {
  const patient = useEyeScreeningStore((s) => s.patient);
  const setPatientField = useEyeScreeningStore((s) => s.setPatientField);
  const setHistory = useEyeScreeningStore((s) => s.setHistory);

  const canNext = useMemo(() => {
    return (
      patient.fullName.trim().length > 0 &&
      patient.age.trim().length > 0 &&
      patient.phone.trim().length > 0 &&
      patient.sex !== ''
    );
  }, [patient]);

  const sexLabel =
    patient.sex === 'male'
      ? 'Male'
      : patient.sex === 'female'
        ? 'Female'
        : patient.sex === 'other'
          ? 'Other'
          : '—';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EyeScreenHeader title="Patient Details" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <EyeLabeledField
          label="Full Name"
          value={patient.fullName}
          onChangeText={(t) => setPatientField('fullName', t)}
          placeholder="Full name"
        />
        <View style={styles.row2}>
          <View style={styles.col}>
            <EyeLabeledField
              label="Age"
              value={patient.age}
              onChangeText={(t) => setPatientField('age', t)}
              placeholder="Age"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.col}>
            <EyeSelectField
              label="Sex"
              valueLabel={sexLabel}
              onPress={() => {
                const order = ['', 'male', 'female', 'other'] as const;
                const i = order.indexOf(patient.sex as (typeof order)[number]);
                setPatientField('sex', order[(i + 1) % order.length]);
              }}
            />
          </View>
        </View>
        <EyeLabeledField
          label="Phone Number"
          value={patient.phone}
          onChangeText={(t) => setPatientField('phone', t)}
          keyboardType="phone-pad"
          placeholder="Phone"
        />
        <EyeLabeledField
          label="Village / Location"
          value={patient.village}
          onChangeText={(t) => setPatientField('village', t)}
          placeholder="Village or location"
        />

        <EyeSurfacePanel style={styles.card}>
          <Text style={styles.cardHead}>Medical History</Text>
          {HISTORY_ROWS.map((row, idx) => (
            <View key={row.key}>
              {idx > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.histRow}>
                <Text style={styles.histLabel}>{row.label}</Text>
                <EyeBinaryChoice
                  size="sm"
                  value={patient.history[row.key]}
                  onYes={() => setHistory(row.key, true)}
                  onNo={() => setHistory(row.key, false)}
                />
              </View>
            </View>
          ))}
        </EyeSurfacePanel>

        <EyePrimaryButton
          title="Next →"
          disabled={!canNext}
          onPress={() => router.replace('/screening/visual-acuity')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: eyeTheme.bg },
  body: { padding: eyeTheme.screenPad, paddingBottom: eyeTheme.screenPadBottom },
  row2: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  col: { flex: 1 },
  card: { marginTop: 8, marginBottom: 24 },
  cardHead: {
    fontSize: 17,
    fontWeight: '700',
    color: eyeTheme.primary,
    padding: 16,
    paddingBottom: 8,
  },
  divider: { height: 1, backgroundColor: eyeTheme.border, marginLeft: 16 },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  histLabel: { flex: 1, fontSize: 15, color: eyeTheme.textSecondary },
});

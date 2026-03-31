import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button, theme, MedicalDisclaimer } from '@healthscan/ui';
import { useAuth } from '@/context/auth';

const VERSION = '2026-03-31';

export default function ConsentScreen() {
  const { api, setConsentLocal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function accept() {
    setErr('');
    setLoading(true);
    try {
      await api.me.consent(VERSION);
      await setConsentLocal(VERSION);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Could not save consent');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h}>Informed consent</Text>
      <Text style={styles.p}>
        HealthScan collects self-reported and task-derived screening data to
        show trends and educational guidance. We are not providing medical
        diagnosis or treatment. You may export or request deletion of your data
        subject to policy timelines.
      </Text>
      <Text style={styles.p}>
        By continuing you confirm you understand this is a screening tool only
        and agree to the current privacy notice (v{VERSION}).
      </Text>
      {err ? <Text style={styles.err}>{err}</Text> : null}
      <Button
        title={loading ? 'Saving…' : 'I understand and agree'}
        onPress={accept}
        disabled={loading}
      />
      <MedicalDisclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: theme.space.lg,
    backgroundColor: theme.colors.bg,
    flexGrow: 1,
  },
  h: {
    fontSize: theme.type.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.space.md,
  },
  p: {
    fontSize: theme.type.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.space.md,
  },
  err: { color: theme.colors.riskRed, marginBottom: theme.space.sm },
});

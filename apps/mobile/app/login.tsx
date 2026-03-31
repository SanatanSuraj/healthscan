import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Button, theme, MedicalDisclaimer } from '@healthscan/ui';
import { useAuth } from '@/context/auth';

export default function LoginScreen() {
  const { api, setTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setErr('');
    setLoading(true);
    try {
      const res = await api.auth.login(email.trim(), password);
      await setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        userId: res.userId,
      });
      router.replace('/');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  async function onGuest() {
    setErr('');
    setLoading(true);
    try {
      const res = await api.auth.guest();
      await setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        userId: res.userId,
      });
      router.replace('/');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Guest start failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.wrap}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>HealthScan</Text>
        <Text style={styles.sub}>
          Preliminary screening — not a diagnosis.
        </Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Email"
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          accessibilityLabel="Password"
        />
        {err ? <Text style={styles.err}>{err}</Text> : null}
        <Button
          title={loading ? 'Please wait…' : 'Sign in'}
          onPress={onSubmit}
          disabled={loading}
        />
        <View style={{ height: theme.space.md }} />
        <Button title="Create account" variant="ghost" onPress={() => router.push('/register')} />
        <View style={{ height: theme.space.md }} />
        <Button title="Continue as guest" variant="secondary" onPress={onGuest} />
        <MedicalDisclaimer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: theme.space.lg,
    paddingTop: 48,
    backgroundColor: theme.colors.bg,
    flexGrow: 1,
  },
  title: {
    fontSize: theme.type.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sub: { marginTop: theme.space.sm, color: theme.colors.textSecondary },
  input: {
    marginTop: theme.space.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.space.md,
    fontSize: theme.type.body,
    backgroundColor: theme.colors.surface,
    minHeight: 48,
  },
  err: { color: theme.colors.riskRed, marginTop: theme.space.sm },
});

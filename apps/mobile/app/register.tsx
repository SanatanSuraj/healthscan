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
import { AppBackLink } from '@/components/AppBackLink';
import { webScrollContent } from '@/lib/webLayout';
import { useAuth } from '@/context/auth';

export default function RegisterScreen() {
  const { api, setTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setErr('');
    setLoading(true);
    try {
      const res = await api.auth.register(email.trim(), password);
      await setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        userId: res.userId,
      });
      router.replace('/consent');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Registration failed');
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
        contentContainerStyle={
          Platform.OS === 'web'
            ? [webScrollContent.centeredColumn, styles.wrapWeb]
            : styles.wrap
        }
      >
        <AppBackLink fallbackHref="/login" />
        <Text style={styles.title}>Create your account</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
        />
        {err ? <Text style={styles.err}>{err}</Text> : null}
        <Button
          title={loading ? 'Please wait…' : 'Register'}
          onPress={onSubmit}
          disabled={loading}
        />
        <MedicalDisclaimer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: theme.space.lg,
    paddingTop: 24,
    backgroundColor: theme.colors.bg,
    flexGrow: 1,
  },
  wrapWeb: {
    flexGrow: 1,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: theme.type.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.space.lg,
  },
  input: {
    marginBottom: theme.space.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.space.md,
    backgroundColor: theme.colors.surface,
    minHeight: 48,
  },
  err: { color: theme.colors.riskRed, marginBottom: theme.space.sm },
});

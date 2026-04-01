import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { theme, MedicalDisclaimer, eyeTheme, mindTheme } from '@healthscan/ui';
import { webScrollContent } from '@/lib/webLayout';
import { useAuth } from '@/context/auth';

export default function HomeScreen() {
  const { api } = useAuth();
  const q = useQuery({
    queryKey: ['scores', 'latest'],
    queryFn: () => api.scores.latest() as Promise<Record<string, unknown> | null>,
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        Platform.OS === 'web'
          ? webScrollContent.centeredColumn
          : styles.wrap
      }
    >
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoEye}>👁</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.appName}>MobiLab EyeCare</Text>
          <Text style={styles.tag}>Primary Eye Screening & Triage Platform</Text>
        </View>
      </View>

      <Pressable
        style={styles.primaryCta}
        onPress={() => router.push('/screening')}
      >
        <Text style={styles.primaryCtaText}>Open Vision Screening</Text>
      </Pressable>

      <View style={styles.mindHero}>
        <View style={styles.mindLogo}>
          <Text style={styles.mindLogoEmoji}>🧠</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.mindAppName}>MindCare</Text>
          <Text style={styles.mindTag}>
            Mental wellness & validated screening tools
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.mindCta}
        onPress={() => router.push('/mind')}
      >
        <Text style={styles.mindCtaText}>Open MindCare</Text>
      </Pressable>

      {Platform.OS === 'web' ? <View style={styles.sectionDivider} /> : null}

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.meta}>
        {q.isError
          ? 'Connect to the API for historical scores.'
          : 'Use the screening module for the full 6-step protocol.'}
      </Text>

      <MedicalDisclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg, paddingBottom: 48 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.space.lg,
    gap: 14,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: eyeTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEye: { fontSize: 26 },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: eyeTheme.primary,
  },
  tag: {
    fontSize: 13,
    color: eyeTheme.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  primaryCta: {
    backgroundColor: eyeTheme.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: theme.space.lg,
  },
  primaryCtaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  mindHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.space.lg,
    marginTop: theme.space.md,
    gap: 14,
  },
  mindLogo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: mindTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mindLogoEmoji: { fontSize: 26 },
  mindAppName: {
    fontSize: 20,
    fontWeight: '800',
    color: mindTheme.primary,
  },
  mindTag: {
    fontSize: 13,
    color: mindTheme.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  mindCta: {
    backgroundColor: mindTheme.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: theme.space.lg,
  },
  mindCtaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  sectionDivider: {
    marginTop: 28,
    marginBottom: 8,
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.border,
    opacity: 0.85,
  },
  sectionTitle: {
    fontSize: theme.type.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  meta: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.space.lg,
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Card, theme } from '@healthscan/ui';
import { webScrollContent } from '@/lib/webLayout';

const TIPS = [
  {
    title: 'Sleep and cognition',
    body: 'Consistent sleep supports attention and memory in day-to-day screening indicators.',
  },
  {
    title: 'Screen distance',
    body: 'For vision self-checks, follow the on-screen distance guidance; results are approximate.',
  },
  {
    title: 'Eye comfort',
    body: 'Follow 20-20-20 breaks during long screen sessions — helpful for comfort, not a diagnosis.',
  },
];

export default function TipsScreen() {
  return (
    <ScrollView
      style={styles.bg}
      contentContainerStyle={
        Platform.OS === 'web'
          ? webScrollContent.centeredColumn
          : styles.wrap
      }
    >
      <Text style={styles.h}>Education</Text>
      <Text style={styles.p}>General wellness tips — not personal medical advice.</Text>
      {TIPS.map((t) => (
        <Card key={t.title} style={{ marginBottom: theme.space.md }}>
          <Text style={styles.t}>{t.title}</Text>
          <Text style={styles.b}>{t.body}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg },
  h: { fontSize: theme.type.xl, fontWeight: '700', color: theme.colors.text },
  p: { marginTop: theme.space.sm, color: theme.colors.textSecondary, marginBottom: theme.space.lg },
  t: { fontWeight: '600', fontSize: theme.type.body, color: theme.colors.text },
  b: { marginTop: theme.space.sm, color: theme.colors.textSecondary, lineHeight: 22 },
});

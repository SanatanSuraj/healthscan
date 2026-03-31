import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, theme } from '@healthscan/ui';

export default function TestsHub() {
  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.wrap}>
      <Text style={styles.h}>Screenings</Text>
      <Text style={styles.p}>
        Complete Mind (cognitive) and Vision modules. Same flows on web and
        mobile — use a stable network connection.
      </Text>
      <Card style={{ marginBottom: theme.space.md }}>
        <Text style={styles.cardTitle}>Mind module</Text>
        <Text style={styles.cardMeta}>~8 min · Memory, attention, reaction, stress</Text>
        <Button title="Start" onPress={() => router.push('/mind')} />
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Vision module</Text>
        <Text style={styles.cardMeta}>~7 min · Calibration + vision checks</Text>
        <Button title="Start" variant="secondary" onPress={() => router.push('/eye')} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg, paddingBottom: 40 },
  h: { fontSize: theme.type.xl, fontWeight: '700', color: theme.colors.text },
  p: { marginTop: theme.space.md, color: theme.colors.textSecondary, lineHeight: 22 },
  cardTitle: { fontWeight: '700', fontSize: theme.type.lg, color: theme.colors.text },
  cardMeta: { color: theme.colors.textSecondary, marginVertical: theme.space.sm },
});

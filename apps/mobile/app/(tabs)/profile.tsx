import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, theme, MedicalDisclaimer } from '@healthscan/ui';
import { webScrollContent } from '@/lib/webLayout';
import { useAuth } from '@/context/auth';

export default function ProfileScreen() {
  const { api, logout } = useAuth();
  const [age, setAge] = useState('');
  const [large, setLarge] = useState(false);
  const prof = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.me.getProfile() as Promise<{ age?: number; a11y?: { largeText?: boolean } }>,
  });

  React.useEffect(() => {
    if (prof.data?.age) setAge(String(prof.data.age));
    if (prof.data?.a11y?.largeText != null) setLarge(!!prof.data.a11y.largeText);
  }, [prof.data]);

  async function save() {
    await api.me.updateProfile({
      age: age ? Number(age) : undefined,
      a11y: { largeText: large },
    });
    void prof.refetch();
  }

  async function onLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <ScrollView
      style={styles.bg}
      contentContainerStyle={
        Platform.OS === 'web'
          ? webScrollContent.centeredColumn
          : styles.wrap
      }
    >
      <Text style={styles.h}>Profile</Text>
      <Card>
        <Text style={styles.label}>Age (optional)</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Larger text (accessibility)</Text>
          <Switch value={large} onValueChange={setLarge} accessibilityLabel="Large text" />
        </View>
        <Button title="Save profile" onPress={save} />
      </Card>
      <View style={{ height: theme.space.md }} />
      <Button title="Sign out" variant="ghost" onPress={onLogout} />
      <MedicalDisclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg },
  wrap: { padding: theme.space.lg },
  h: { fontSize: theme.type.xl, fontWeight: '700', color: theme.colors.text, marginBottom: theme.space.md },
  label: { fontWeight: '600', color: theme.colors.text, marginBottom: theme.space.sm },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.space.md,
    marginBottom: theme.space.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.space.md },
});

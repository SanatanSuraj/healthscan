import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mindTheme } from '../mindTheme';

export function MindHelplineCard() {
  return (
    <LinearGradient
      colors={['#F0FDF4', '#FFFFFF']}
      style={styles.card}
    >
      <Text style={styles.line1}>🆘 KIRAN Helpline</Text>
      <Text style={styles.phone}>1800-599-0019</Text>
      <Text style={styles.footer}>Free · 24/7 · 13 languages</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: mindTheme.radiusLg,
    borderWidth: 2,
    borderColor: mindTheme.greenBody,
    padding: mindTheme.gapLg,
    width: '100%',
    alignItems: 'center',
    marginVertical: mindTheme.gapLg,
  },
  line1: {
    fontSize: 17,
    fontWeight: '800',
    color: mindTheme.greenHeading,
  },
  phone: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '900',
    color: mindTheme.helplinePhone,
  },
  footer: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: mindTheme.greenMuted,
  },
});

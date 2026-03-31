import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { eyeTheme } from '../eyeTheme';

export function EyeListCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

/** One row in the landing “Screening Modules” list */
export function EyeModuleListRow({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.moduleIcon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function EyeListRowDivider() {
  return <View style={styles.divider} />;
}

const ICON_W = 36;

const styles = StyleSheet.create({
  card: {
    backgroundColor: eyeTheme.surface,
    borderRadius: eyeTheme.radiusLg,
    borderWidth: 1,
    borderColor: eyeTheme.border,
    paddingVertical: 8,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: eyeTheme.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: eyeTheme.border,
    marginLeft: 16 + ICON_W,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  moduleIcon: { fontSize: 22, width: ICON_W },
  label: {
    flex: 1,
    fontSize: 16,
    color: eyeTheme.textSecondary,
    fontWeight: '500',
  },
});

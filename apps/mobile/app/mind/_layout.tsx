import React from 'react';
import { Stack } from 'expo-router';
import { mindTheme } from '@healthscan/ui';

export default function MindLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: mindTheme.bgTop },
        animation: 'slide_from_right',
      }}
    />
  );
}

import React from 'react';
import { Stack } from 'expo-router';
import { eyeTheme } from '@healthscan/ui';

export default function ScreeningLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: eyeTheme.bg },
        animation: 'slide_from_right',
      }}
    />
  );
}

import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth';
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts';
import { WebViewportShell } from '@/lib/WebViewportShell';
import { StatusBar } from 'expo-status-bar';

const qc = new QueryClient();

function RealtimeBridge() {
  useRealtimeAlerts();
  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RealtimeBridge />
        <WebViewportShell>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#F7F9FC' },
              gestureEnabled: true,
              fullScreenGestureEnabled: true,
            }}
          />
        </WebViewportShell>
      </AuthProvider>
    </QueryClientProvider>
  );
}

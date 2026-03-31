import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/auth';
import { connectRealtime } from '@/lib/socket';

export function useRealtimeAlerts() {
  const { ready, userId, accessToken } = useAuth();

  useEffect(() => {
    if (!ready || !userId || !accessToken) return;
    const socket = connectRealtime(userId, accessToken);
    socket.on('alert:new', (p: { type?: string }) => {
      Alert.alert(
        'HealthScan',
        p?.type === 'decline_alert'
          ? 'Your recent screening score changed notably vs your average. This is not a diagnosis.'
          : 'You have a new notification.',
      );
    });
    return () => {
      socket.disconnect();
    };
  }, [ready, userId, accessToken]);
}

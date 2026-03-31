import { io, type Socket } from 'socket.io-client';
import { getApiBaseUrl } from '@/lib/apiBaseUrl';

export function connectRealtime(userId: string, accessToken: string): Socket {
  const apiUrl = getApiBaseUrl();
  return io(apiUrl, {
    transports: ['websocket'],
    auth: { userId },
    extraHeaders: { Authorization: `Bearer ${accessToken}` },
  });
}

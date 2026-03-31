import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Resolves the API base URL for native/web clients.
 *
 * Priority: `EXPO_PUBLIC_API_URL` → `app.json` `expo.extra.apiUrl` → `http://localhost:3000`
 *
 * **Native + `localhost`:** Expo exposes the dev machine via `hostUri` / `debuggerHost`.
 * We swap that in so **physical phones** and most **Expo Go** setups hit your computer.
 * **Android emulator:** if no LAN host is present, falls back to `10.0.2.2`.
 * **iOS Simulator:** keeps `localhost` when no LAN host is present (Mac loopback).
 */
function getEnvApiUrl(): string {
  const proc = (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process;
  return proc?.env?.EXPO_PUBLIC_API_URL?.trim() ?? '';
}

/** Hostname of the machine running Metro (LAN), not loopback. */
function getDevMachineHost(): string | null {
  const cfg = Constants.expoConfig as { hostUri?: string } | undefined;
  const hostUri = cfg?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }

  const legacy = (Constants as { manifest?: { debuggerHost?: string } }).manifest
    ?.debuggerHost;
  if (legacy) {
    const host = legacy.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }

  return null;
}

function rewriteLoopbackForNative(url: string): string {
  if (Platform.OS === 'web') {
    return url;
  }

  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }

  const loopback = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  if (!loopback) {
    return url;
  }

  const devHost = getDevMachineHost();
  if (devHost) {
    u.hostname = devHost;
    return u.toString().replace(/\/$/, '');
  }

  if (Platform.OS === 'android') {
    u.hostname = '10.0.2.2';
    return u.toString().replace(/\/$/, '');
  }

  return url;
}

export function getApiBaseUrl(): string {
  const env = getEnvApiUrl();
  const extra = (
    Constants.expoConfig?.extra as { apiUrl?: string } | undefined
  )?.apiUrl?.trim();

  const url = (env || extra || 'http://localhost:3000').replace(/\/$/, '');
  return rewriteLoopbackForNative(url);
}

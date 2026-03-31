import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createHealthScanApi,
  type HealthScanApi,
} from '@healthscan/api-client';
import { getApiBaseUrl } from '@/lib/apiBaseUrl';

const ACCESS = 'hs_access';
const REFRESH = 'hs_refresh';
const CONSENT = 'hs_consent_v';
const UID = 'hs_uid';

type AuthCtx = {
  ready: boolean;
  userId: string | null;
  accessToken: string | null;
  consentVersion: string | null;
  api: HealthScanApi;
  setTokens: (t: {
    accessToken: string;
    refreshToken: string;
    userId?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setConsentLocal: (version: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [consentVersion, setConsentVersion] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [a, r, cv, u] = await Promise.all([
        AsyncStorage.getItem(ACCESS),
        AsyncStorage.getItem(REFRESH),
        AsyncStorage.getItem(CONSENT),
        AsyncStorage.getItem(UID),
      ]);
      setAccessToken(a);
      setRefreshToken(r);
      setConsentVersion(cv);
      setUserId(u);
      setReady(true);
    })();
  }, []);

  const setTokens = useCallback(
    async (t: {
      accessToken: string;
      refreshToken: string;
      userId?: string;
    }) => {
      setAccessToken(t.accessToken);
      setRefreshToken(t.refreshToken);
      const pairs: [string, string][] = [
        [ACCESS, t.accessToken],
        [REFRESH, t.refreshToken],
      ];
      if (t.userId) {
        setUserId(t.userId);
        pairs.push([UID, t.userId]);
      }
      await AsyncStorage.multiSet(pairs);
    },
    [],
  );

  const logout = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    setConsentVersion(null);
    await AsyncStorage.multiRemove([ACCESS, REFRESH, UID, CONSENT]);
  }, []);

  const setConsentLocal = useCallback(async (version: string) => {
    setConsentVersion(version);
    await AsyncStorage.setItem(CONSENT, version);
  }, []);

  const getAccess = useCallback(() => accessToken, [accessToken]);
  const getRefresh = useCallback(() => refreshToken, [refreshToken]);

  const apiUrl = useMemo(() => getApiBaseUrl(), []);

  const api = useMemo(
    () =>
      createHealthScanApi(apiUrl, getAccess, getRefresh, (t) => void setTokens(t)),
    [apiUrl, getAccess, getRefresh, setTokens],
  );

  const value = useMemo(
    () =>
      ({
        ready,
        userId,
        accessToken,
        consentVersion,
        api,
        setTokens,
        logout,
        setConsentLocal,
      }) satisfies AuthCtx,
    [
      ready,
      userId,
      accessToken,
      consentVersion,
      api,
      setTokens,
      logout,
      setConsentLocal,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth requires AuthProvider');
  return v;
}

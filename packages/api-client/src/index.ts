export type TokenGetter = () => string | null;
export type TokenSetter = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => void;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function createHealthScanApi(
  baseUrl: string,
  getAccess: TokenGetter,
  getRefresh: () => string | null,
  setTokens: TokenSetter,
) {
  const root = baseUrl.replace(/\/$/, '');

  async function refreshIfNeeded(): Promise<void> {
    const rt = getRefresh();
    if (!rt) return;
    const res = await fetch(`${root}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    setTokens(data);
  }

  async function request<T>(
    path: string,
    init: RequestInit & { idempotencyKey?: string } = {},
    retries = 3,
  ): Promise<T> {
    const url = path.startsWith('http') ? path : `${root}${path}`;
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string>),
    };
    if (!headers['Content-Type'] && init.body) {
      headers['Content-Type'] = 'application/json';
    }
    const token = getAccess();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (init.idempotencyKey) {
      headers['Idempotency-Key'] = init.idempotencyKey;
    }
    const { idempotencyKey: _ik, ...rest } = init;

    async function fetchJson(): Promise<Response> {
      try {
        return await fetch(url, { ...rest, headers });
      } catch {
        throw new Error(
          `Network error. Please try again. No response from ${root} — start the API (apps/api), and on a physical device set EXPO_PUBLIC_API_URL to your computer's LAN IP on the same Wi‑Fi.`,
        );
      }
    }

    let res = await fetchJson();

    if (res.status === 401 && getRefresh()) {
      await refreshIfNeeded();
      headers['Authorization'] = `Bearer ${getAccess() ?? ''}`;
      res = await fetchJson();
    }

    const text = await res.text();
    let body: unknown = undefined;
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      body = text;
    }

    if (!res.ok) {
      if (retries > 0 && res.status >= 500) {
        await sleep(200 * (4 - retries));
        return request<T>(path, init, retries - 1);
      }
      throw new ApiError(`HTTP ${res.status}`, res.status, body);
    }

    return body as T;
  }

  return {
    request,
    auth: {
      register: (email: string, password: string) =>
        request<{
          accessToken: string;
          refreshToken: string;
          userId: string;
        }>('/v1/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }),
      login: (email: string, password: string) =>
        request<{
          accessToken: string;
          refreshToken: string;
          userId: string;
        }>('/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }),
    },
    me: {
      getProfile: () => request<unknown>('/v1/me/profile'),
      updateProfile: (body: unknown) =>
        request<unknown>('/v1/me/profile', {
          method: 'PUT',
          body: JSON.stringify(body),
        }),
      consent: (version: string) =>
        request<unknown>('/v1/me/consent', {
          method: 'POST',
          body: JSON.stringify({ version }),
        }),
    },
    sessions: {
      create: (body: unknown) =>
        request<{ _id: string }>('/v1/sessions', {
          method: 'POST',
          body: JSON.stringify(body),
        }),
      submit: (sessionId: string, body: unknown, idempotencyKey?: string) =>
        request<unknown>(`/v1/sessions/${sessionId}/submit`, {
          method: 'POST',
          body: JSON.stringify(body),
          idempotencyKey,
        }),
      list: () => request<unknown[]>('/v1/sessions'),
    },
    scores: {
      latest: () => request<unknown>('/v1/scores/latest'),
      history: (range?: string) =>
        request<unknown>(
          `/v1/scores/history${range ? `?range=${encodeURIComponent(range)}` : ''}`,
        ),
    },
    results: {
      list: () => request<unknown[]>('/v1/results'),
      one: (id: string) => request<unknown>(`/v1/results/${id}`),
    },
    notifications: {
      list: () => request<unknown[]>('/v1/notifications'),
      markRead: (id: string) =>
        request<unknown>(`/v1/notifications/${id}/read`, { method: 'PATCH' }),
    },
    analytics: {
      track: (events: { event: string; props?: Record<string, unknown> }[]) =>
        request<unknown>('/v1/analytics/events', {
          method: 'POST',
          body: JSON.stringify({ events }),
        }),
    },
  };
}

export type HealthScanApi = ReturnType<typeof createHealthScanApi>;

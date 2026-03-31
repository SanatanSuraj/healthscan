# HealthScan

Preliminary **Mind + Vision screening** platform (not diagnostic). Monorepo layout:

- `apps/mobile` — Expo (iOS, Android, **Web** via `expo start --web`)
- `apps/web` — convenience scripts delegating to mobile web build
- `apps/api` — NestJS + MongoDB + Redis + Socket.IO
- `packages/ui` — shared theme + accessible UI primitives
- `packages/api-client` — fetch wrapper with refresh + idempotent submit
- `packages/test-engine` — pure TS helpers (RT validity, CPT, stress, calibration)
- `packages/types` — shared DTO shapes
- `infra/` — Terraform stub + k6 smoke script

## Quick start (API)

```bash
cp .env.example .env
docker compose up -d mongo redis
cd apps/api && npm install && npm run start:dev
```

Open Swagger: `http://localhost:3000/docs`

## Mobile + web

Start the API first (`apps/api` on port **3000**), then:

```bash
cd apps/mobile && pnpm install && npx expo start
# press w for web, i / a for simulators
```

**API URL (fixes “Network error” / guest login on devices)**

Default is `http://localhost:3000` in `app.json`. On **native**, that URL is rewritten so the app does not talk to the phone’s own loopback:

- Uses Expo’s **`hostUri` / `debuggerHost`** (your dev machine’s LAN IP from Metro) when available — works for **Expo Go on a physical phone** on the same Wi‑Fi as your computer.
- **Android emulator:** falls back to **`10.0.2.2`** if no LAN host is present.
- **iOS Simulator:** keeps **`localhost`** when no LAN host is present (reaches your Mac).
- **Android** dev builds allow **HTTP** to the API via `usesCleartextTraffic` in `app.json`.

If you use **`expo start --tunnel`** or the auto host is wrong, set **`EXPO_PUBLIC_API_URL`** in `apps/mobile/.env` (see `.env.example`), then `npx expo start -c`.

Ensure the API is listening on **`0.0.0.0:3000`** (default in `apps/api` with `HOST`) so LAN devices can connect.

## Docker (API only)

```bash
docker compose up --build
```

## Compliance

Screening-only copy is enforced in UI (`MedicalDisclaimer`, results). Production requires legal review, BAAs, and KMS/encryption policies per your jurisdiction.

From the repo root (with pnpm):


pnpm --filter web dev


cd apps/api && npm run start:dev# healthscan

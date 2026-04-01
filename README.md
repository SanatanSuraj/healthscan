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

**Expo Go on a phone: “Unknown error: The request timed out” (exp://192.168.x.x:8081)**

Metro is telling the device to load JS from your computer’s LAN IP on port **8081**. The timeout means the **phone never reached that host:port** (common on school/office Wi‑Fi, guest networks, VPNs, or strict firewalls).

1. Put **phone and computer on the same Wi‑Fi** (not guest isolation / “AP isolation”).
2. On macOS, allow **Node** (or **Terminal/iTerm**) if the firewall prompts; or try **Turn off firewall** briefly to test.
3. **Easiest fix:** use a tunnel so the phone does not need LAN access to your IP:
   ```bash
   cd apps/mobile && pnpm run start:tunnel
   ```
   Scan the **new** QR in Expo Go (URL will look like `exp://u.expo.dev/...`, not `192.168.x.x`).
4. After your machine’s IP changes, restart with cache clear: `pnpm run start:clear`.

**API URL (fixes “Network error” on devices)**

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

```bash
pnpm --filter web dev
```

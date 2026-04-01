import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Resolve from this file’s directory so loading works whether `cwd` is repo root,
 * `apps/api`, or `apps/api/dist` (Nest build).
 * Monorepo `.env` first, then `apps/api/.env` for overrides.
 */
export function resolveEnvFilePaths(): string[] {
  const apiPackageRoot = join(__dirname, '..');
  const monorepoRoot = join(apiPackageRoot, '..', '..');
  const candidates = [
    join(monorepoRoot, '.env'),
    join(apiPackageRoot, '.env'),
  ];
  return candidates.filter((p) => existsSync(p));
}

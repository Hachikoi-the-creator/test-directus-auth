import {
  authentication,
  createDirectus,
  rest,
  staticToken,
} from '@directus/sdk';

export const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_API || 'http://localhost:8055';

/** REST only — e.g. `/auth/refresh` without a Bearer token. */
export function createBareDirectus() {
  return createDirectus(DIRECTUS_URL).with(rest());
}

/** User-scoped requests with a static Bearer token (safe for concurrent server handlers). */
export function getAuthenticatedDirectus(accessToken: string) {
  return createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(accessToken));
}

/** In-memory JSON auth — use only for a single `login()` / `logout()` call, not shared across requests. */
export function createAuthDirectus() {
  return createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(authentication('json', { credentials: 'omit' }));
}

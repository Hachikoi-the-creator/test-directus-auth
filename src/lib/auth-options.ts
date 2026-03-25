import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DIRECTUS_URL } from './directus';

type DirectusAuthResponse = {
  access_token: string;
  refresh_token?: string | null;
  expires?: number | null;
  user?: { id?: string; first_name?: string; name?: string };
};

function decodeJwtExpSeconds(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as { exp?: number };
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

/** Directus `expires` may be seconds (900) or ms (900000); JWT `exp` is authoritative when present. */
function accessExpiresAtMs(
  expires: number | null | undefined,
  accessJwt: string,
): number {
  const jwtExpSec = decodeJwtExpSeconds(accessJwt);
  if (jwtExpSec != null) {
    return jwtExpSec * 1000;
  }
  if (typeof expires === 'number' && expires > 0) {
    if (expires < 2_000_000) {
      return Date.now() + expires * 1000;
    }
    return Date.now() + expires;
  }
  return Date.now() + 15 * 60 * 1000;
}

async function refreshDirectusAccessToken(
  refreshToken: string,
): Promise<DirectusAuthResponse> {
  const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'json', refresh_token: refreshToken }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: DirectusAuthResponse;
  } & DirectusAuthResponse;
  if (!res.ok) {
    throw new Error('RefreshAccessTokenError');
  }
  const data = json.data ?? json;
  if (!data?.access_token) {
    throw new Error('RefreshAccessTokenError');
  }
  return data;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          return null;
        }
        const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, mode: 'json' }),
        });
        const json = (await res.json().catch(() => ({}))) as {
          data?: DirectusAuthResponse;
        } & DirectusAuthResponse;
        if (!res.ok) {
          return null;
        }
        const data = json.data ?? json;
        if (!data?.access_token) {
          return null;
        }
        return {
          id: String(data.user?.id ?? email),
          email,
          name: data.user?.first_name ?? data.user?.name ?? undefined,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expires: data.expires,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign-in
      if (user && 'accessToken' in user) {
        const u = user as any;
        return {
          ...token,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: accessExpiresAtMs(u.expires, u.accessToken),
          user: { id: u.id, email: u.email, name: u.name }, // optional
        };
      }

      // Subsequent calls (refresh or session check)
  if (!token.refreshToken) return token;

  const skewMs = 60_000; // 1 minute buffer
  const shouldRefresh = 
    typeof token.accessTokenExpires === 'number' && 
    Date.now() > token.accessTokenExpires - skewMs;

  if (!shouldRefresh) return token;

  try {
    const data = await refreshDirectusAccessToken(token.refreshToken as string);
    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken, // Directus sometimes rotates refresh too
      accessTokenExpires: accessExpiresAtMs(data.expires, data.access_token),
      error: undefined,
    };
  } catch (err) {
    console.error('Token refresh failed:', err);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
},
async session({ session, token }) {
  session.accessToken = token.accessToken as string;
  if (token.error) session.error = token.error as string;
  if (session.user) {
    session.user.id = token.sub as string;
  }
  return session;
},
  },
};

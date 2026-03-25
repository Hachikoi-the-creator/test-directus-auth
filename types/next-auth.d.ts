import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    accessToken: string;
    refreshToken?: string | null;
    expires?: number | null;
  }

  interface Session {
    accessToken?: string;
    error?: string;
    user: DefaultSession['user'] & { id: string };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

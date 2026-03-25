import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './auth-options';

/** Valid Directus access token from the NextAuth JWT (refreshed in the `jwt` callback when needed). */
export async function requireDirectusAccessToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken || session.error === 'RefreshAccessTokenError') {
    redirect('/login');
  }
  return session.accessToken;
}

// lib/dal.ts
'use server';
import 'server-only';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import { DIRECTUS_URL } from '@/lib/directus';
import { CustomDirectusTypes } from '@/types/api-collection';

export async function getAuthenticatedDirectus() {
    const session = await getSession();
    if (!session?.accessToken) {
      redirect('/login');
    }
    console.log('=== DEBUG SESSION @getAuthenticatedDirectus ===');
    console.log('Has accessToken?', !!session?.accessToken);
    console.log('AccessToken (first 50 chars):', session?.accessToken?.slice(0, 50) + '...');
    console.log('AccessTokenExpires:', new Date((session?.user as any)?.accessTokenExpires as number || 0));
    return createDirectus<CustomDirectusTypes>(DIRECTUS_URL)
      .with(rest())
      .with(staticToken(session.accessToken as string));
  }
  
  export async function getSession() {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      redirect('/login');
    }
    return session;
  }
  
  export async function ensureAuthenticated() {
    return await getSession();   // or just call getSession() directly
  }
'use server';
import { readMe } from '@directus/sdk';
import { redirect } from 'next/navigation';
import { getAuthenticatedDirectus } from './directus';
import { requireDirectusAccessToken } from './directus-auth';

export async function getUserData() {
  try {
    const token = await requireDirectusAccessToken();
    const client = getAuthenticatedDirectus(token);
    const user = await client.request(readMe());
    return { success: true, user };
  } catch (error) {
    console.log(error);
    redirect('/login');
  }
}

export async function logout() {
  redirect(
    '/api/auth/signout?callbackUrl=' + encodeURIComponent('/login'),
  );
}

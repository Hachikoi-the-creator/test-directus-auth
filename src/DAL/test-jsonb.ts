'use server';
import 'server-only';

import { getAuthenticatedDirectus } from './directus-helpers';
import { createItem, deleteItem, readItems, updateItem } from '@directus/sdk';

export type TestJsonbItem = {
  id: string;
  user_created?: string | null;
  date_created?: string | null;
  user_updated?: string | null;
  date_updated?: string | null;
  JSON_1?: unknown;
  JSON_2?: unknown;
};

export async function getAllTestJsonb() {
  const directus = await getAuthenticatedDirectus();

  try {
    const items = await directus.request(readItems('TEST_JSONB', { fields: ['*'] }));
    console.log('items', items.length);
    return items;
  } catch (err: any) {
    console.error('Directus error:', err?.message || err);
    console.error('Full error object:', err);
    throw err;
  }
}


export async function createTestJsonb(data: Pick<TestJsonbItem, 'JSON_1' | 'JSON_2'>) {
  const directus = await getAuthenticatedDirectus();
  const item = await directus.request(createItem('TEST_JSONB', data));
  return item;
}

export async function updateTestJsonb(
  id: string,
  data: Pick<TestJsonbItem, 'JSON_1' | 'JSON_2'>,
) {
  const directus = await getAuthenticatedDirectus();
  const item = await directus.request(updateItem('TEST_JSONB', id, data));
  return item;
}

export async function deleteTestJsonb(id: string) {
  const directus = await getAuthenticatedDirectus();
  const item = await directus.request(deleteItem('TEST_JSONB', id));
  return item;
}
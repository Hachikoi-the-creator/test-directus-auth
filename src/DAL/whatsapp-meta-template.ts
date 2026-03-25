'use server';
import 'server-only';

import type { WaTemplate } from '@/types/whatsapp';
import { requireDirectusAccessToken } from '@/lib/directus-auth';
import { getAuthenticatedDirectus } from './directus-helpers';
import { readItems } from '@directus/sdk';
import { Companies, Contacts, EventRulesSubChannel, Events, Leads } from '@/types/api-collection';
import { CustomSubChannelId, getSubChannels } from './sub-channels';

export async function getMetaTemplates(): Promise<WaTemplate[]> {
  try {
    const token = await requireDirectusAccessToken();
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_API || '';

    const res = await fetch(`${baseUrl}/api/v1/meta-templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log({
        error: data?.error || 'Failed to get wa templates',
        status: res.status,
      });
      return [];
    }

    return data.templates.flatMap((t: { data: WaTemplate }) => t.data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.log({
      error: message,
      status: 500,
    });
    return [];
  }
}


export const getTemplateVariables = async (
  ): Promise<{
    leads: Leads[];
    companies: Companies[];
    contacts: Contacts[];
    events: Events[];
    subChannels: EventRulesSubChannel<CustomSubChannelId>[];
  }> => {
    const client = await getAuthenticatedDirectus();
        const [leads, companies, contacts, events, subChannels] = await Promise.all([
      client.request(
        readItems("leads", {
          fields: ["*", { contact: ["*"] }],
        })
      ),
      client.request(
        readItems("companies", {
          fields: ["*"],
        })
      ),
      client.request(
        readItems("contacts", {
          fields: ["*"],
        })
      ),
      client.request(
        readItems("events", {
          fields: ["*"],
        })
      ),
      getSubChannels(),
    ]);
  
    return { leads, companies, contacts, events, subChannels };
  };
  
  export const getSubChannelFromManyToAny = async (
    token: string,
    tableUuid: string,
    tableName: any
  ) => {
    const client = await getAuthenticatedDirectus();

    const subChannel = await client.request(
      readItems(tableName, {
        filter: { id: { _eq: tableUuid } },
      })
    );
    return subChannel;
  };
  
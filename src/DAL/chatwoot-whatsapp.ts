'use server';
import 'server-only';

import type { ChawootWhatsapp } from "@/types/api-collection";
import { readItems } from "@directus/sdk";
import { getAuthenticatedDirectus } from './directus-helpers';

export const getChatwootWhatsapp = async () => {
  const directus = await getAuthenticatedDirectus();
  const chatwootWhatsapp = await directus.request(
    readItems("chawoot_whatsapp", {
      fields: [
        "id",
        "name",
        "phone_number",
        "inbox_id",
        "user_created",
        "user_updated",
      ],
    })
  );

  return chatwootWhatsapp as ChawootWhatsapp[];
};

'use server';
import 'server-only';

import { type EventTypes } from "@/types/api-collection";
import { readItems } from "@directus/sdk";
import { getAuthenticatedDirectus } from "./directus-helpers";

export const getEventTypes = async (): Promise<EventTypes[]> => {
  const directus = await getAuthenticatedDirectus();
  const eventType = await directus.request(
    readItems("event_types", {
      fields: ["id", "name"],
    })
  );

  if (!eventType || !eventType.length) {
    return [];
  }

  return eventType as EventTypes[];
};

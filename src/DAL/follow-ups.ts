'use server';
import 'server-only';

import { createItem, deleteItem, readItem, readItems, updateItem } from "@directus/sdk";
import { getAuthenticatedDirectus } from "./directus-helpers";
import { EventRules } from "@/types/api-collection";

/** Known as event rules in the frontend */
export async function getFollowUps() {
  const directus = await getAuthenticatedDirectus();
  const eventTypes = await directus.request(
    readItems("event_rules", {
      fields: [
        "id",
        "name",
        {
          event_type: ["name"],
          sub_channel: ["sub_channel_id.*", "sub_channel"],
        },
        "offset_minutes",
        "date_created",
        "date_updated",
        "custom_params",
      ],
    })
  );
  return eventTypes as EventRules[];
}

export async function getFollowUpById(id: string) {
  const directus = await getAuthenticatedDirectus();
  const followUp = await directus.request(readItem('event_rules', id));
  return followUp as EventRules;
}

export async function createFollowUp(followUp: Omit<EventRules, 'id'>) {
  const directus = await getAuthenticatedDirectus();
  const newFollowUp = await directus.request(createItem('event_rules', followUp));
  return newFollowUp;
}

export async function updateFollowUp(followUp: Pick<EventRules, 'id' | 'name' | 'offset_minutes'>) {
  const directus = await getAuthenticatedDirectus();
  const updatedFollowUp = await directus.request(updateItem('event_rules', followUp.id, followUp));
  return updatedFollowUp;
}

export async function deleteFollowUp(id: string) {
  const directus = await getAuthenticatedDirectus();
  const deletedFollowUp = await directus.request(deleteItem('event_rules', id));
  return deletedFollowUp;
}


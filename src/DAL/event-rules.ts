"use server";
import 'server-only';

import { createItem, deleteItem, readItems, updateItem } from "@directus/sdk";
import { getAuthenticatedDirectus } from './directus-helpers';
import { EventRules } from '@/types/api-collection';

export async function getEventRules() {
  const directus = await getAuthenticatedDirectus();
  const eventRules = await directus.request(
    readItems("event_rules", {
      fields: ["*"],
    })
  );
  return eventRules as EventRules[];
}

// Minimal payload for createEventRule
type Payload = {
    name: string;
    sub_channel: string[];
    event_type: string;
    offset_minutes: number;
    custom_params: Record<string, any>;
  };

export async function createEventRule(eventRule: Payload) {
  const directus = await getAuthenticatedDirectus();
  const newEventRule = await directus.request(createItem('event_rules', eventRule as EventRules));
  return newEventRule;
}

export async function updateEventRule(id: string, eventRule: Partial<EventRules>) {
  const directus = await getAuthenticatedDirectus();
  const updatedEventRule = await directus.request(updateItem('event_rules', id, eventRule));
  return updatedEventRule as EventRules;
}

export async function deleteEventRule(id: string) {
  const directus = await getAuthenticatedDirectus();
  const deletedEventRule = await directus.request(deleteItem('event_rules', id));
  return deletedEventRule;
}
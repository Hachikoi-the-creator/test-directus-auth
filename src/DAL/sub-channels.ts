'use server';
import 'server-only';

import { type EventRulesSubChannel } from "@/types/api-collection";
import { readItems } from "@directus/sdk";
import { getAuthenticatedDirectus } from "./directus-helpers";

export type CustomSubChannelId = {
  id: string;
  name: string;
};

export const getSubChannels = async (): Promise<EventRulesSubChannel<CustomSubChannelId>[]> => {
  const client = await getAuthenticatedDirectus();
  const subChannels = await client.request(
    readItems("event_rules_sub_channel", {
      fields: [
        "id",
        "sub_channel",
        // @ts-ignore - this is a false negative
        {
          sub_channel_id: ["id", "name"],
        },
      ],
    })
  );

  return subChannels as EventRulesSubChannel<CustomSubChannelId>[];
};

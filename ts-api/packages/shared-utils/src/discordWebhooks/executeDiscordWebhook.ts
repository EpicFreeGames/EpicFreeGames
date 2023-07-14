import { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v10";

import { botConstants } from "@efg/configuration";

import { discordApi } from "../apis/discordApi";

type Props = {
  webhookId: string;
  webhookToken: string;
  threadId?: string | null;
  body: Omit<RESTPostAPIWebhookWithTokenJSONBody, "username">;
};

export const executeDiscordWebhook = ({ threadId, webhookId, webhookToken, body }: Props) =>
  discordApi(
    {
      method: "POST",
      path: `/webhooks/${webhookId}/${webhookToken}`,
      ...(threadId && { query: new URLSearchParams({ thread_id: threadId }) }),
      body: {
        ...body,
        username: botConstants.botName,
      } as RESTPostAPIWebhookWithTokenJSONBody,
    },
    { useProxy: false }
  );

import {
  RESTPostAPIChannelWebhookJSONBody,
  RESTPostAPIChannelWebhookResult,
} from "discord-api-types/v10";

import { discordApi } from "../apis/discordApi";

type Props = {
  channelId: string;
  body: RESTPostAPIChannelWebhookJSONBody;
};

export const createDiscordWebhook = ({ channelId, body }: Props) =>
  discordApi<RESTPostAPIChannelWebhookResult>({
    method: "POST",
    path: `/channels/${channelId}/webhooks`,
    body,
  });

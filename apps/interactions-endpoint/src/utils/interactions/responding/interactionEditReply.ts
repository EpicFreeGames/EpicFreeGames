import { APIInteractionResponseCallbackData } from "discord-api-types/v10";

import { configuration } from "@efg/configuration";
import { discordApi } from "@efg/shared-utils";

export const interactionEditReply = (
  interactionToken: string,
  options: APIInteractionResponseCallbackData
) =>
  discordApi({
    method: "PATCH",
    path: `/webhooks/${configuration.DISCORD_BOT_ID}/${interactionToken}/messages/@original`,
    body: options,
  });

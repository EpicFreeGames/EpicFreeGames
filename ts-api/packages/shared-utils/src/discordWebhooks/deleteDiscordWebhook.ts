import { discordApi } from "../apis/discordApi";

type Props = {
  webhookId: string;
  webhookToken: string;
};

export const deleteDiscordWebhook = ({ webhookId, webhookToken }: Props) =>
  discordApi({
    method: "DELETE",
    path: `/webhooks/${webhookId}/${webhookToken}`,
  });

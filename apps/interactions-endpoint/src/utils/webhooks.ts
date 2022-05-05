import axios from "axios";
import { config, constants } from "config";
import { APIWebhook, RESTGetAPIChannelWebhooksResult } from "discord-api-types";
import { IWebhook, discordApiRequest } from "shared";

export const createWebhook = async (channelId: string): Promise<IWebhook | null> => {
  try {
    const res = await axios(
      discordApiRequest(`/channels/${channelId}/webhooks`, "POST", {
        name: constants.webhookName,
        avatar: constants.photos.base64Thumb,
      })
    );

    return {
      id: res.data.id,
      token: res.data.token,
    };
  } catch (err: any) {
    if (err.response && err.response?.data?.code === 30007) throw new Error(err.response.data.code);

    console.log("error creating a webhook:", err.message, err?.response?.data);
    return null;
  }
};

const getWebhooks = async (channelId: string): Promise<APIWebhook[] | null> => {
  try {
    const res = await axios(discordApiRequest(`/channels/${channelId}/webhooks`, "GET"));

    if (Array.isArray(res.data)) return res.data as RESTGetAPIChannelWebhooksResult;

    return null;
  } catch (err: any) {
    console.log("error creating a webhook:", err.message);
    if (err?.response && err?.response?.data?.code) throw new Error(err.response.data.code);

    return null;
  }
};

export const hasWebhook = async (channelId: string): Promise<IWebhook | null> => {
  const webhooks = await getWebhooks(channelId);

  if (webhooks) {
    const webhook = webhooks.find((webhook) => webhook.user!.id === config.botId);
    if (webhook) return { id: webhook.id, token: webhook.token! };
    return null;
  }

  return null;
};

export const deleteWebhook = async (webhook: IWebhook) =>
  axios(discordApiRequest(`/webhooks/${webhook.id}/${webhook.token}`, "DELETE"));

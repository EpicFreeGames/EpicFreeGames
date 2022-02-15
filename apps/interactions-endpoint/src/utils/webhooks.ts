import axios from "axios";
import { IWebhook } from "shared";
import { discordApiRequest } from "./axiosConfig";

export const deleteWebhook = async (webhook: IWebhook) =>
  axios(discordApiRequest(`/webhooks/${webhook.id}/${webhook.token}`, "DELETE"));

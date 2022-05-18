import mongoose from "mongoose";
import { ICurrency, ILanguage } from "./Internationalization";

export interface IWebhook {
  id: string;
  token: string;
}

export interface IGuild {
  guildId: string;
  roleId: string | null;
  channelId: string | null;
  threadId: string | null;
  language: ILanguage | null;
  currency: ICurrency | null;
  webhook: IWebhook | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuildDocument extends IGuild, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

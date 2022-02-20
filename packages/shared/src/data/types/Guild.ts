import mongoose from "mongoose";
import { Languages } from "../../localisation";

export interface IWebhook {
  id: string;
  token: string;
}

export interface IGuild {
  guildId: string;
  roleId: string | null;
  channelId: string | null;
  language: Languages;
  webhook: IWebhook | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuildDocument extends IGuild, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

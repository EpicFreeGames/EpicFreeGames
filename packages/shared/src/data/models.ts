import mongoose from "mongoose";
import { IGame, GuildDocument, ICommandLog, SendingLogDocument } from "./types";
import { Languages } from "../localisation";

export const rightMongo = mongoose;

export const GameModel = mongoose.model<IGame>(
  "game",
  new mongoose.Schema<IGame>({
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    price: {
      USD: { type: String, required: true },
      CAD: { type: String, required: true },
      EUR: { type: String, required: true },
    },
    slug: { type: String, required: true },
  })
);

export const GuildModel = mongoose.model<GuildDocument>(
  "guild",
  new mongoose.Schema<GuildDocument>({
    guildId: { type: String, required: true },
    roleId: { type: String, default: null },
    channelId: { type: String, default: null },
    language: { type: String, default: Languages.en },
    webhook: {
      type: {
        id: String,
        token: String,
      },
      default: null,
    },
  })
);

export const CommandLogModel = mongoose.model<ICommandLog>(
  "command-log",
  new mongoose.Schema<ICommandLog>(
    {
      command: { type: String },
      sender: {
        id: { type: String },
        tag: { type: String },
      },
      guildId: { type: String, default: null },
      respondedIn: { type: Number },
    },
    { timestamps: true }
  )
);

export const SendingLogModel = mongoose.model<SendingLogDocument>(
  "sending-log",
  new mongoose.Schema<SendingLogDocument>(
    {
      guildId: { type: String, required: true },
      sendingId: { type: String, required: true },
      type: { type: String, required: true },
      result: {
        success: { type: Boolean, required: true },
        reason: { type: String, default: null },
      },
    },
    { timestamps: true }
  )
);

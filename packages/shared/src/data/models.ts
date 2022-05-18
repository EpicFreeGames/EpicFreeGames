import mongoose from "mongoose";
import { IGame, GuildDocument, ICommandLog, SendingLogDocument } from "./types";
import { CurrencyDocument, LanguageDocument } from "./types/Internationalization";

const { Schema } = mongoose;

export const GameModel = mongoose.model<IGame>(
  "game",
  new mongoose.Schema<IGame>({
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    confirmed: { type: Boolean, required: true },
    price: {
      USD: { type: String },
      CAD: { type: String },
      EUR: { type: String },
      INR: { type: String },
      GBP: { type: String },
      UAH: { type: String },
      RUB: { type: String },
      BYN: { type: String },
      IDR: { type: String },
      NZD: { type: String },
      VND: { type: String },
    },
  })
);

export const GuildModel = mongoose.model<GuildDocument>(
  "guild",
  new mongoose.Schema<GuildDocument>({
    guildId: { type: String, required: true },
    roleId: { type: String, default: null },
    channelId: { type: String, default: null },
    threadId: { type: String, default: null },
    language: { type: Schema.Types.ObjectId, ref: "language", default: null },
    currency: { type: Schema.Types.ObjectId, ref: "currency", default: null },
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

export const LanguageModel = mongoose.model<LanguageDocument>(
  "language",
  new mongoose.Schema<LanguageDocument>(
    {
      code: { type: String, required: true, unique: true },
      englishName: { type: String, required: true },
      localizedName: { type: String, required: true },
    },
    { timestamps: true }
  )
);

export const CurrencyModel = mongoose.model<CurrencyDocument>(
  "currency",
  new mongoose.Schema<CurrencyDocument>(
    {
      code: { type: String, required: true },
      name: { type: String, required: true },
      apiValue: { type: String, required: true },
      inFrontOfPrice: { type: String, required: true },
      afterPrice: { type: String, required: true },
    },
    { timestamps: true }
  )
);

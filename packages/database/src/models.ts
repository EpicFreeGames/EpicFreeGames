import mongoose from "mongoose";
import {
  IGame,
  CommandLogDocument,
  CurrencyDocument,
  GuildDocument,
  LanguageDocument,
  SendingLogDocument,
} from "shared";

const { Schema } = mongoose;

export const GameModel = mongoose.modelNames().includes("game")
  ? (mongoose.models["game"] as mongoose.Model<IGame, {}, {}, {}>)
  : mongoose.model<IGame>(
      "game",
      new mongoose.Schema<IGame>({
        name: { type: String, required: true, unique: true },
        imageUrl: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        confirmed: { type: Boolean, required: true },
        revalidate: { type: Boolean, default: false },
        price: { type: Object },
        link: { type: String, required: true },
      })
    );

export const GuildModel = mongoose.modelNames().includes("guild")
  ? (mongoose.models["guild"] as mongoose.Model<GuildDocument, {}, {}, {}>)
  : mongoose.model<GuildDocument>(
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

export const CommandLogModel = mongoose.modelNames().includes("command-log")
  ? (mongoose.models["command-log"] as mongoose.Model<CommandLogDocument, {}, {}, {}>)
  : mongoose.model<CommandLogDocument>(
      "command-log",
      new mongoose.Schema<CommandLogDocument>(
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

export const SendingLogModel = mongoose.modelNames().includes("sending-log")
  ? (mongoose.models["sending-log"] as mongoose.Model<SendingLogDocument, {}, {}, {}>)
  : mongoose.model<SendingLogDocument>(
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

export const LanguageModel = mongoose.modelNames().includes("language")
  ? (mongoose.models["language"] as mongoose.Model<LanguageDocument, {}, {}, {}>)
  : mongoose.model<LanguageDocument>(
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

export const CurrencyModel = mongoose.modelNames().includes("currency")
  ? (mongoose.models["currency"] as mongoose.Model<CurrencyDocument, {}, {}, {}>)
  : mongoose.model<CurrencyDocument>(
      "currency",
      new mongoose.Schema<CurrencyDocument>(
        {
          code: { type: String, required: true, unique: true },
          name: { type: String, required: true },
          apiValue: { type: String, required: true },
          inFrontOfPrice: { type: String, default: "" },
          afterPrice: { type: String, default: "" },
        },
        { timestamps: true }
      )
    );

import { ICommandLog } from "./CommandLog";
import { IGuild } from "./Guild";
import { ICurrency, ILanguage } from "./Internationalization";
import { ISendingLog } from "./SendingLog";

export interface DocumentStuff {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GuildDocument = IGuild & DocumentStuff;
export type CommandLogDocument = ICommandLog & DocumentStuff;
export type SendingLogDocument = ISendingLog & DocumentStuff;
export type LanguageDocument = ILanguage & DocumentStuff;
export type CurrencyDocument = ICurrency & DocumentStuff;

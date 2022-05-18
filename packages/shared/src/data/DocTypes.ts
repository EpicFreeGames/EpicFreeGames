import { IGuild, ICommandLog, ISendingLog, ILanguage, ICurrency } from "types";

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

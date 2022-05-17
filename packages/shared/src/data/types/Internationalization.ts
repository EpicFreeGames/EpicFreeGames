import mongoose from "mongoose";

export interface ILanguage {
  code: string;
  name: string;
  localizedName: string;
}

export interface ICurrency {
  code: string;
  name: string;
  apiValue: string;
  inFrontOfPrice: string;
  afterPrice: string;
}

export interface ILanguageWithGuildCount extends ILanguage {
  guildCount: number;
}

export interface ICurrencyWithGuildCount extends ICurrency {
  guildCount: number;
}

export interface LanguageDocument extends ILanguage, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrencyDocument extends ICurrency, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

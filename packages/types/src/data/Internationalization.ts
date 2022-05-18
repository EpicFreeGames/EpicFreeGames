export interface ILanguage {
  code: string;
  englishName: string;
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
  isDefault?: boolean;
}

export interface ICurrencyWithGuildCount extends ICurrency {
  guildCount: number;
  isDefault?: boolean;
}

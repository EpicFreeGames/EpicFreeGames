import { ILanguage, ICurrency, IGuild } from "./data";

const English: ILanguage = {
  englishName: "English",
  localizedName: "English",
  code: "en",
};

const USD: ICurrency = {
  code: "USD",
  apiValue: "US",
  inFrontOfPrice: "$",
  afterPrice: "",
  name: "$ Dollar (USD)",
};

export const getGuildLang = (guild?: IGuild | null): ILanguage => guild?.language ?? English;

export const getGuildCurrency = (guild?: IGuild | null): ICurrency => guild?.currency ?? USD;

export const getDefaultCurrency = (): ICurrency => USD;

export const getDefaultLanguage = (): ILanguage => English;

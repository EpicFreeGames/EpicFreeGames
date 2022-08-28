import { api } from "../api.ts";
import { Currency, Language } from "../types.ts";
import { logger } from "../utils/logger.ts";

let defaultLanguage: Language | null = null;
export const languages = new Map<string, Language>();

let defaultCurrency: Currency | null = null;
export const currencies = new Map<string, Currency>();

const translations = new Map<string, Record<string, string>>();
let defaultTranslations: Record<string, string> | null = null;

export const initI18n = async () => {
  logger.info("Initializing i18n");

  const { error: error1, data: apiTranslations } = await api<
    Record<string, Record<string, string>>
  >({
    method: "GET",
    path: "/i18n/translations",
  });

  const { error: error2, data: apiDefaultTranslations } = await api<Record<string, string>>({
    method: "GET",
    path: "/i18n/defaults/translations",
  });

  const { error: error3, data: apiDefaultLanguage } = await api<Language>({
    method: "GET",
    path: "/i18n/defaults/language",
  });

  const { error: error4, data: apiLanguages } = await api<Record<string, Language>>({
    method: "GET",
    path: "/i18n/languages",
  });

  const { error: error5, data: apiDefaultCurrency } = await api<Currency>({
    method: "GET",
    path: "/i18n/defaults/currency",
  });

  const { error: error6, data: apiCurrencies } = await api<Record<string, Currency>>({
    method: "GET",
    path: "/i18n/currencies",
  });

  if (error1 || error2 || error3 || error4 || error5 || error6) {
    logger.error("Failed to initialize i18n");

    Deno.exit(1);
  }

  Object.entries(apiTranslations).map(([languageCode, langTranslations]) =>
    translations.set(languageCode, langTranslations)
  );

  defaultTranslations = apiDefaultTranslations;

  defaultLanguage = apiDefaultLanguage;
  Object.entries(apiLanguages).map(([languageCode, language]) =>
    languages.set(languageCode, language)
  );

  defaultCurrency = apiDefaultCurrency;
  Object.entries(apiCurrencies).map(([currencyCode, currency]) =>
    currencies.set(currencyCode, currency)
  );
};

export const getDefaultLanguage = () => defaultLanguage!;
export const getLanguage = (languageCode: string) => languages.get(languageCode);

export const getDefaultCurrency = () => defaultCurrency!;
export const getCurrency = (currencyCode: string) => currencies.get(currencyCode);

export const getDefaultTranslations = () => defaultTranslations;
export const getTranslations = (languageCode: string) => translations.get(languageCode);

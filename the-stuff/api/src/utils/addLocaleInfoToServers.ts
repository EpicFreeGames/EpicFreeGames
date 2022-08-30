import { Server } from "@prisma/client";

import { currencies, defaultCurrency } from "../i18n/currencies";
import { defaultLanguage, languages } from "../i18n/languages";
import { ICurrency, ILanguage } from "../i18n/types";

export const addLocaleInfoToServer = (
  server: Server
): Server & { currency: ICurrency; language: ILanguage } => ({
  ...server,
  currency: currencies.get(server.currencyCode) ?? defaultCurrency,
  language: languages.get(server.languageCode) ?? defaultLanguage,
});

export const addLocaleInfoToServers = (
  servers: Server[]
):
  | (Server & { currency: ICurrency; language: ILanguage })
  | (Server & { currency: ICurrency; language: ILanguage })[] => servers.map(addLocaleInfoToServer);

import { Server } from "@prisma/client";

import { currencies, defaultCurrency, defaultLanguage, languages } from "@efg/i18n";
import { ICurrency, ILanguage } from "@efg/types";

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

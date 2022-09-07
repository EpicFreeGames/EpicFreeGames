import { configuration } from "@efg/configuration";

import { Flags } from "../auth/flags";

export const bots = [
  {
    identifier: "bot",
    token: configuration.VALID_BOT_TOKEN,
    flags:
      Flags.AddCommandLogs |
      Flags.EditServers |
      Flags.GetGames |
      Flags.GetTranslations |
      Flags.GetCurrencies |
      Flags.GetLanguages |
      Flags.GetServers |
      Flags.GetSendingLogs |
      Flags.GetSendings |
      Flags.AddSendingLogs |
      Flags.EditSendings,
  },
  {
    identifier: "frontend",
    token: configuration.VALID_FRONT_TOKEN,
    flags: Flags.GetLanguages | Flags.GetTranslations,
  },
  {
    identifier: "scraper",
    token: configuration.VALID_SCRAPER_TOKEN,
    flags: Flags.PutGames | Flags.GetCurrencies,
  },
  {
    identifier: "healtcheck",
    token: configuration.VALID_HEALTHCHECK_TOKEN,
    flags: Flags.GetHealth,
  },
];
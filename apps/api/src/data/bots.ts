import { Flags } from "../auth/flags";
import { config } from "../config";

export const bots = [
  {
    identifier: "bot",
    token: config.VALID_BOT_TOKEN,
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
    token: config.VALID_FRONT_TOKEN,
    flags: Flags.GetLanguages | Flags.GetTranslations,
  },
  {
    identifier: "scraper",
    token: config.VALID_SCRAPER_TOKEN,
    flags: Flags.PutGames | Flags.GetCurrencies,
  },
  {
    identifier: "healtcheck",
    token: config.VALID_HEALTHCHECK_TOKEN,
    flags: Flags.GetHealth,
  },
];

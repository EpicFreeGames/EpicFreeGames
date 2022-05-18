import {
  ILanguage,
  ICurrency,
  LanguageDocument,
  CurrencyDocument,
  CommandTypes,
  discordApiUrl,
  getCommands,
} from "shared";
import { botId, botToken, guildId } from "./envs";

export const getCommandsToDeploy = async (
  languages: (LanguageDocument | ILanguage)[],
  currencies: (CurrencyDocument | ICurrency)[]
) => {
  const commands = getCommands(languages, currencies);

  const guildCommands = [];
  const globalCommands = [];

  for (const command of commands) {
    guildCommands.push(command.data);

    if (command.type === CommandTypes.ADMIN) continue;

    globalCommands.push(command.data);
  }

  return { guildCommands, globalCommands };
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bot ${botToken}`,
};

export const globalDeploy = (commands: any[]) =>
  fetch(`${discordApiUrl}/applications/${botId}/commands`, {
    method: "PUT",
    headers,
    body: JSON.stringify(commands),
  });

export const guildDeploy = (commands: any[]) =>
  fetch(`${discordApiUrl}/applications/${botId}/guilds/${guildId}/commands`, {
    method: "PUT",
    headers,
    body: JSON.stringify(commands),
  });

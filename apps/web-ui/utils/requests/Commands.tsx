import { config } from "config";
import {
  db,
  getDefaultCurrency,
  getDefaultLanguage,
  getCommands,
  discordApiUrl,
  CommandTypes,
} from "shared";

export const updateCommands = async () => {
  await db.connect();

  const languages = await Promise.all([db.languages.get.all(), getDefaultLanguage()]);
  const currencies = await Promise.all([db.currencies.get.all(), getDefaultCurrency()]);

  const commands = getCommands(languages.flat(), currencies.flat());

  const guildCommands = [];
  const globalCommands = [];

  for (const command of commands) {
    guildCommands.push(command.data);

    if (command.type === CommandTypes.ADMIN) continue;

    globalCommands.push(command.data);

    await guildDeploy(guildCommands);
    await globalDeploy(globalCommands);
  }
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bot ${config.botToken}`,
};

const globalDeploy = (commands: any[]) =>
  fetch(`${discordApiUrl}/applications/${config.botId}/commands`, {
    method: "PUT",
    headers,
    body: JSON.stringify(commands),
  });

const guildDeploy = (commands: any[]) =>
  fetch(`${discordApiUrl}/applications/${config.botId}/guilds/${config.guildId}/commands`, {
    method: "PUT",
    headers,
    body: JSON.stringify(commands),
  });

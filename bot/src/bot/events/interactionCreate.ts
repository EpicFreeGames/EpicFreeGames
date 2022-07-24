import { ApplicationCommandOptionTypes, EventHandlers, Interaction } from "discordeno";
import { logger } from "~logger";
import { api } from "../../api.ts";
import { defaultCurrency, defaultLanguage, languages } from "../../i18n/languages.ts";
import { Server } from "../../types.ts";
import { commands } from "../commands/mod.ts";
import { bot } from "../mod.ts";

export const interactionCreateHandler: EventHandlers["interactionCreate"] = async (_bot, i) => {
  const command = commands.get(i.data?.name ?? "");
  if (!command) return;

  if (command.needsGuild && !i.guildId) return;

  let language = defaultLanguage;
  let currency = defaultCurrency;

  const commandName = getCommandName(i);

  const { error, data: server } = await api<Server | undefined>({
    method: "GET",
    path: `/servers/${i.guildId}`,
  });

  if (!error && server) {
    if (server.languageCode !== defaultLanguage.code && languages.has(server.languageCode))
      language = languages.get(server.languageCode)!;

    server.currency && (currency = server.currency);
  }

  try {
    logger.debug(`Executing command: ${command.name}`);

    await command.execute({
      bot,
      i,
      commandName,
      server,
      lang: language,
      curr: currency,
    });

    const { error } = await api({
      method: "POST",
      path: "/logs/commands",
      body: {
        command: commandName,
        senderId: String(i.user.id),
        serverId: String(i.guildId),
        error: null,
      },
    });
    !!error && logger.error("Error logging command:", error);

    logger.debug(`Command executed: ${command.name}`);
    // deno-lint-ignore no-explicit-any
  } catch (err: any) {
    logger.error(`Command failed: ${command.name}, error: \n${err?.stack ?? err}`);

    const { error } = await api({
      method: "POST",
      path: "/logs/commands",
      body: {
        command: commandName,
        senderId: String(i.user.id),
        serverId: String(i.guildId),
        error: err?.message ?? "some error",
      },
    });
    !!error && logger.error("Error logging command:", error);
  }
};

const getCommandName = (i: Interaction): string => {
  if (!i.data) return "no-name";

  const subCmd = i.data?.options?.find(
    (option) => option.type === ApplicationCommandOptionTypes.SubCommand
  );

  return `/${i?.data?.name}${subCmd ? ` ${subCmd.name}` : ""}`;
};

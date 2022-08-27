import {
  ApplicationCommandOptionTypes,
  EventHandlers,
  Interaction,
  InteractionResponseTypes,
  InteractionTypes,
  PermissionStrings,
} from "discordeno";

import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Server } from "~shared/types.ts";
import { logger } from "~shared/utils/logger.ts";

import { getDefaultCurrency, getDefaultLanguage } from "../../_shared/i18n/index.ts";
import { commands } from "../commands/mod.ts";
import { bot } from "../mod.ts";

export const interactionCreateHandler: EventHandlers["interactionCreate"] = async (_bot, i) => {
  const command = commands.get(i.data?.name ?? "");
  if (!command) return;

  if (command.needsGuild && !i.guildId) return;

  logger.debug(`Executing command: ${command.name}`);

  const commandName = getCommandName(i);

  const { data: server } = await api<Server | undefined>({
    method: "GET",
    path: `/servers/${i.guildId}`,
  });

  const language = server?.language ?? getDefaultLanguage();
  const currency = server?.currency ?? getDefaultCurrency();

  if (command.needsManageGuild && !hasPerms(i, ["MANAGE_GUILD"]))
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: 64,
        embeds: [embeds.errors.unauthorized.manageGuildCommand(language)],
      },
    });

  try {
    await command.execute({
      bot,
      i,
      commandName,
      server,
      lang: language,
      curr: currency,
    });

    // only log commands that aren't autocomplete completions
    if (i.type !== InteractionTypes.ApplicationCommandAutocomplete) {
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
    }

    logger.debug(`Command executed: ${command.name}`);
    // deno-lint-ignore no-explicit-any
  } catch (err: any) {
    logger.error(`Command failed: ${command.name}, error: \n${err?.stack ?? err}`);

    // only log commands that aren't autocomplete completions
    if (i.type !== InteractionTypes.ApplicationCommandAutocomplete) {
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
  }
};

const getCommandName = (i: Interaction): string => {
  if (!i.data) return "no-name";

  const subCmd = i.data?.options?.find(
    (option) => option.type === ApplicationCommandOptionTypes.SubCommand
  );

  return `/${i?.data?.name}${subCmd ? ` ${subCmd.name}` : ""}`;
};

const hasPerms = (i: Interaction, neededPerms: PermissionStrings[]): boolean => {
  const memberPerms = i.member?.permissions;
  if (!memberPerms) return false;

  const neededBigint = bot.transformers.snowflake(bot.utils.calculateBits(neededPerms));

  return (memberPerms & neededBigint) === neededBigint;
};

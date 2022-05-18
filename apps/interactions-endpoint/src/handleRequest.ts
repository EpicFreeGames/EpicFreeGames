import { config } from "config";
import { Request, Response } from "express";
import {
  CommandInteraction,
  CommandTypes,
  db,
  embeds,
  getDefaultCurrency,
  getDefaultLanguage,
  getGuildLang,
  getGuildCurrency,
  logger,
  SlashCommand,
} from "shared";
import { ILanguage } from "types";
import { commands } from "./commands";
import { isAuthorized } from "./utils/Authorization";

import { requestToInteraction } from "./utils/requestToInteraction";

export const handleRequests = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body) return;

  const i = requestToInteraction(req, res);

  const command = commands.get(i.command.name);
  if (!command) return;

  let language = getDefaultLanguage();
  let currency = getDefaultCurrency();
  let dbGuild = null;

  if (i.guildId) {
    dbGuild = await db.guilds.get.one(i.guildId);

    if (dbGuild) {
      language = getGuildLang(dbGuild);
      currency = getGuildCurrency(dbGuild);
    }
  }

  if (!i.guildId && command.needsGuild)
    return i.reply({ content: "This command has to be run on a server!" }).catch(() => null);

  if (!isAuthorized(i, command))
    return handleMissingPermissions(i, command, language).catch(() => null);

  try {
    await command.execute(i, dbGuild, language, currency);
  } catch (err: any) {
    // prettier-ignore
    logger.discord({
      content: `<@${config.adminIds[0]}>`,
      embeds: [embeds.errors.error(`Failed to run \`${i.getFullCommandName()}\`\n${err.message}`)],
    }).catch((err: any) => console.error(err.message));

    logger.console(`failed to run ${i.getFullCommandName()} ${err.message}`);
  }
};

const handleMissingPermissions = async (
  i: CommandInteraction,
  command: SlashCommand,
  language: ILanguage
) => {
  if (command.type !== CommandTypes.ADMIN)
    return i.reply({
      embeds: [embeds.errors.unauthorized.manageGuildCommand(language)],
      ephemeral: true,
    });

  return i.reply({
    embeds: [embeds.errors.unauthorized.adminOnlyCommand(language)],
    ephemeral: true,
  });
};

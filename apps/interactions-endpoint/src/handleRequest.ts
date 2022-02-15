import { Request, Response } from "express";
import {
  CommandInteraction,
  CommandTypes,
  db,
  embeds,
  getGuildLang,
  Languages,
  logger,
  SlashCommand,
} from "shared";
import { commands } from "./commands";
import { isAuthorized } from "./utils/Authorization";

import { requestToInteraction } from "./utils/requestToInteraction";

export const handleRequests = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body) return;

  const i = requestToInteraction(req);

  const command = commands.get(i.command.name);
  if (!command) return;

  let langauge = Languages.en;
  let dbGuild = null;

  if (i.guildId) {
    dbGuild = await db.guilds.get.one(i.guildId);

    if (dbGuild) langauge = getGuildLang(dbGuild);
  }

  if (!i.guildId && command.needsGuild)
    return i.reply({ content: "This command has to be run on a server!" }).catch(() => null);

  if (!isAuthorized(i, command)) return handleMissingPermissions(i, command, langauge);

  try {
    await command.execute(i, dbGuild, langauge);
  } catch (err: any) {
    logger.discord({ content: `failed to run ${i.command.name} ${err.message}` });

    logger.console(`failed to run ${i.command.name} ${err.message}`);
  }
};

const handleMissingPermissions = async (
  interaction: CommandInteraction,
  command: SlashCommand,
  language: Languages
) => {
  if (command.type !== CommandTypes.ADMIN)
    return await interaction.reply({
      embeds: [embeds.errors.unauthorized.manageGuildCommand(language)],
      ephemeral: true,
    });

  await interaction.reply({
    embeds: [embeds.errors.unauthorized.adminOnlyCommand(language)],
    ephemeral: true,
  });
};
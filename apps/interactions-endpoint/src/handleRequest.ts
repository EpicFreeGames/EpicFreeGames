import { InteractionType, MessageFlags } from "discord-api-types/v10";
import { Request, Response } from "express";

import { embeds } from "@efg/embeds";
import { defaultCurrency, defaultLanguage } from "@efg/i18n";
import { logger } from "@efg/logger";
import { IServer } from "@efg/types";

import { commands } from "./commands";
import { efgApi } from "./utils/efgApi/efgApi";
import { interactionGetCommandName } from "./utils/interactions/interactionGetCommandName";
import { interactionReply } from "./utils/interactions/responding/interactionReply";
import { SlashCommand } from "./utils/interactions/types";
import { objToStr } from "./utils/jsonStringify";
import { hasPerms } from "./utils/perms/hasPerms";

export const handleRequests = async (req: Request, res: Response) => {
  const i = req.body as any;
  if (!i) return;

  const command = commands.get(i.data.name);
  if (!command) return;

  const commandName = interactionGetCommandName(i);

  if (command.needsGuild) return await needsGuildHandler(command, i, res, commandName);

  try {
    const start = Date.now();
    await command.execute(
      { i, server: undefined, language: defaultLanguage, currency: defaultCurrency },
      res
    );
    const end = Date.now();

    logger.success(`Executed ${commandName} in ${end - start}ms`);
  } catch (err: any) {
    logger.error([`Failed to execute ${commandName}`, `Cause: ${objToStr(err)}`].join("\n"));
  }
};

const needsGuildHandler = async (
  command: SlashCommand,
  i: any,
  res: Response,
  commandName: string
) => {
  if (!command.needsGuild) return;

  if (i.type === InteractionType.ApplicationCommandAutocomplete) {
    try {
      const start = Date.now();
      await command.execute(
        { i, server: undefined, language: defaultLanguage, currency: defaultCurrency },
        res
      );
      const end = Date.now();

      logger.success(`Executed ${commandName} (Autocomplete) in ${end - start}ms`);
    } catch (err) {
      logger.error(
        [`Failed to execute ${commandName} (Autocomplete)`, `Cause: ${objToStr(err)}`].join("\n")
      );
    }
    return;
  }

  const { data: server } = await efgApi<IServer | undefined>({
    method: "GET",
    path: `/servers/${i.guild_id}`,
  });

  const language = server?.language || defaultLanguage;
  const currency = server?.currency || defaultCurrency;

  if (command.needsManageGuild && !hasPerms(BigInt(i.member.permissions), ["MANAGE_GUILD"]))
    return interactionReply(
      {
        flags: MessageFlags.Ephemeral,
        embeds: [embeds.errors.manageGuildCommand(language)],
      },
      res
    );

  try {
    const start = Date.now();
    await command.execute({ i, server, language, currency }, res);
    const end = Date.now();

    logger.success(`Executed ${commandName} in ${end - start}ms`);
  } catch (err) {
    logger.error([`Failed to execute ${commandName}`, `Cause: ${objToStr(err)}`].join("\n"));
  }
};

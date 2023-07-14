import { InteractionType, MessageFlags } from "discord-api-types/v10";
import { Request, Response } from "express";

import { embeds } from "@efg/embeds";
import { defaultCurrency, defaultLanguage } from "@efg/i18n";
import { logger } from "@efg/logger";
import { efgApi, objToStr } from "@efg/shared-utils";
import { IServer } from "@efg/types";

import { commands } from "./commands";
import { interactionGetCommandName } from "./utils/interactions/interactionGetCommandName";
import { interactionReply } from "./utils/interactions/responding/interactionReply";
import { SlashCommand } from "./utils/interactions/types";
import { hasPerms } from "./utils/perms/hasPerms";

export const handleRequests = async (req: Request, res: Response) => {
  const i = req.body as any;
  if (!i) return;

  const command = commands.get(i.data.name);
  if (!command) return;

  const commandName = interactionGetCommandName(i);

  if (i.type === InteractionType.ApplicationCommandAutocomplete)
    return autoCompleteHandler(command, i, res, commandName);

  if (command.needsGuild && !i.guild_id) return;

  let server: IServer | undefined = undefined;

  if (i.guild_id) {
    const { data } = await efgApi<IServer | undefined>({
      method: "GET",
      path: `/servers/${i.guild_id}`,
    });

    if (data) server = data;
  }

  const language = server?.language || defaultLanguage;
  const currency = server?.currency || defaultCurrency;

  if (
    command.needsManageGuild &&
    !hasPerms(BigInt(i?.member?.permissions || 0n), ["MANAGE_GUILD"])
  ) {
    logger.info(
      [
        `Did not execute ${commandName}`,
        `Cause: Member did not have the MANAGE_GUILD permission`,
      ].join("\n")
    );

    return interactionReply(
      {
        flags: MessageFlags.Ephemeral,
        embeds: [embeds.errors.manageGuildCommand(language)],
      },
      res
    );
  }

  const senderId = i.member?.user?.id || i.user?.id;

  try {
    const start = Date.now();

    await command.execute({ i, server, language, currency }, res);

    const end = Date.now();

    logger.success(`Executed ${commandName} in ${end - start}ms`);

    efgApi({
      method: "POST",
      path: "/logs/commands",
      body: {
        command: commandName,
        serverId: i.guild_id || null,
        senderId,
        error: null,
      },
    }).catch((err) =>
      logger.error([`Failed to log ${commandName} to efgApi`, `Cause: ${objToStr(err)}`].join("\n"))
    );
  } catch (err: any) {
    logger.error([`Failed to execute ${commandName}`, `Cause: ${objToStr(err)}`].join("\n"));

    efgApi({
      method: "POST",
      path: "/logs/commands",
      body: {
        command: commandName,
        serverId: i.guild_id,
        senderId,
        error: JSON.stringify(err),
      },
    }).catch((err) =>
      logger.error([`Failed to log ${commandName} to efgApi`, `Cause: ${objToStr(err)}`].join("\n"))
    );
  }
};

const autoCompleteHandler = async (
  command: SlashCommand,
  i: any,
  res: Response,
  commandName: string
) => {
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
};

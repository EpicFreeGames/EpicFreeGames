import { InteractionType, MessageFlags } from "discord-api-types/v10";
import { Request, Response } from "express";

import { embeds } from "@efg/embeds";
import { defaultCurrency, defaultLanguage } from "@efg/i18n";
import { IServer } from "@efg/types";

import { commands } from "./commands";
import { efgApi } from "./utils/efgApi/efgApi";
import { interactionReply } from "./utils/interactions/responding/interactionReply";
import { SlashCommand } from "./utils/interactions/types";
import { hasPerms } from "./utils/perms/hasPerms";

export const handleRequests = async (req: Request, res: Response) => {
  const i = req.body as any;
  if (!i) return;

  const command = commands.get(i.data.name);
  if (!command) return;

  if (command.needsGuild) return await needsGuildHandler(command, i, res);

  try {
    await command.execute(
      { i, server: undefined, language: defaultLanguage, currency: defaultCurrency },
      res
    );
  } catch (err: any) {
    console.error(err);
  }
};

const needsGuildHandler = async (command: SlashCommand, i: any, res: Response) => {
  if (!command.needsGuild) return;

  if (i.type === InteractionType.ApplicationCommandAutocomplete) {
    try {
      await command.execute(
        { i, server: undefined, language: defaultLanguage, currency: defaultCurrency },
        res
      );
    } catch (err) {
      console.error(err);
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
    await command.execute({ i, server, language, currency }, res);
  } catch (err) {
    console.error(err);
  }
};

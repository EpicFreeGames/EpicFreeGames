import { MessageFlags } from "discord-api-types/v10";
import { Request, Response } from "express";

import { botConstants } from "@efg/configuration";

import { interactionReply } from "./utils/interactions/responding/interactionReply";

export const handleRequest = async (req: Request, res: Response) => {
  const i = req.body as any;
  if (!i) return;

  interactionReply(
    {
      flags: MessageFlags.Ephemeral,
      embeds: [
        {
          title: "⚠️ Under Maintenance",
          description: `The bot is currently under maintenance. Please check our [support server](${botConstants.website.serverInvite}) for more information.`,
          color: 0xcfc808,
        },
      ],
    },
    res
  );
};

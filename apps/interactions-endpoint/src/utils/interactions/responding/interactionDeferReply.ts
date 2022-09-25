import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { Response } from "express";

type Options = {
  ephemeral?: boolean;
};

export const interactionDeferReply = (res: Response, options?: Options) => {
  res.status(200).json({
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: {
      ...(options?.ephemeral ? { flags: MessageFlags.Ephemeral } : {}),
    },
  });
};

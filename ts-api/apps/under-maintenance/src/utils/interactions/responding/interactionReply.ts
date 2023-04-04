import {
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
} from "discord-api-types/v10";
import { Response } from "express";

export const interactionReply = (
  options:
    | APICommandAutocompleteInteractionResponseCallbackData
    | APIInteractionResponseCallbackData,
  res: Response
) => {
  res.status(200).json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: options,
  });
};

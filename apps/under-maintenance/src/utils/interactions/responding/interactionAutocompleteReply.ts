import {
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
} from "discord-api-types/v10";
import { Response } from "express";

export const interactionAutocompleteReply = (
  options:
    | APICommandAutocompleteInteractionResponseCallbackData
    | APIInteractionResponseCallbackData,
  res: Response
) => {
  res.status(200).json({
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: options,
  });
};

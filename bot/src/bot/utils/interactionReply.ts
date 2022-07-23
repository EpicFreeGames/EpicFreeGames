import {
  Bot,
  Interaction,
  InteractionApplicationCommandCallbackData,
  InteractionResponseTypes,
} from "discordeno";

export const replyToInteraction = async (
  bot: Bot,
  payload: Interaction,
  options:
    | string
    | (InteractionApplicationCommandCallbackData & {
        type?: InteractionResponseTypes;
      })
) => {
  if (typeof options === "string") options = { content: options };

  return await bot.helpers.sendInteractionResponse(payload.id, payload.token, {
    type:
      options.type ?? InteractionResponseTypes.DeferredChannelMessageWithSource,
    data: options,
  });
};

export const privateReplyToInteraction = async (
  bot: Bot,
  payload: Interaction,
  options:
    | string
    | (InteractionApplicationCommandCallbackData & {
        type?: InteractionResponseTypes;
      })
) => {
  if (typeof options === "string") options = { content: options };
  options.flags = 64;

  return await replyToInteraction(bot, payload, { ...options });
};

import { ApplicationCommandTypes, InteractionResponseTypes } from "discordeno";

import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Game } from "~shared/types.ts";

import { Command, EphemeralFlag } from "./mod.ts";

export const freeCommand: Command = {
  name: "free",
  description: "Check out the current free games",

  needsGuild: false,
  type: ApplicationCommandTypes.ChatInput,

  execute: async ({ bot, i, lang, curr }) => {
    const { error, data: games } = await api<Game[]>({
      method: "GET",
      path: "/games/free",
    });

    await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        ...(!!error && { flags: EphemeralFlag }),
        embeds: error
          ? [embeds.errors.genericError()]
          : games.length
          ? games.map((game) => embeds.games.gameEmbed(game, lang, curr))
          : [embeds.games.noFreeGames(lang)],
      },
    });
  },
};
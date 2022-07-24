import { ApplicationCommandTypes, InteractionResponseTypes } from "discordeno";
import { api } from "../../api.ts";
import { gameEmbed } from "../../embeds/games.ts";
import { embeds } from "../../embeds/mod.ts";
import { Game } from "../../types.ts";
import { Command } from "./mod.ts";

export const upCommand: Command = {
  name: "up",
  description: "Check out the upcoming free games",

  needsGuild: false,
  type: ApplicationCommandTypes.ChatInput,

  execute: async ({ bot, i, lang, curr }) => {
    const { error, data: games } = await api<Game[]>({
      method: "GET",
      path: "/games/upcoming",
    });

    await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: error
          ? [embeds.errors.genericError()]
          : games.length
          ? games.map((game) => gameEmbed(game, lang, curr))
          : [embeds.games.noUpcomingGames(lang)],
      },
    });
  },
};

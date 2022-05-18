import { embeds, SlashCommand } from "shared-discord-stuff";
import { db } from "database";
import { CommandTypes } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.EVERYONE,
  execute: async (i, guild, language, currency) => {
    const games = await db.games.get.upcoming();

    if (!games.length) return i.reply({ embeds: [embeds.games.noUpcomingGames(language)] });

    return i.reply({ embeds: embeds.games.games(games, language, currency) });
  },
};

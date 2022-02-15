import { CommandTypes, db, embeds, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.EVERYONE,
  execute: async (i, guild, language) => {
    const games = await db.games.get.free();

    if (!games.length) return i.reply({ embeds: [embeds.games.noFreeGames(language)] });

    return i.reply({ embeds: embeds.games.games(games, language) });
  },
};

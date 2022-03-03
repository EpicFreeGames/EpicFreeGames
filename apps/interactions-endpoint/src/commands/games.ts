import { CommandTypes, db, embeds, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language, currency) => {
    const games = await db.games.get.all();

    if (!games.length) return i.reply({ embeds: [embeds.generic("No games", "No games found")] });

    const gameEmbeds = embeds.games.games(games, language, currency, true);

    return i.reply({ embeds: gameEmbeds, ephemeral: true });
  },
};

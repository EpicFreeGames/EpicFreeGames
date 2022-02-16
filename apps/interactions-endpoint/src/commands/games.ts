import { CommandTypes, db, embeds, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language) => {
    const games = await db.games.get.all();
    const gameEmbeds = embeds.games.games(games, language, true);

    return i.reply({ embeds: gameEmbeds, ephemeral: true });
  },
};

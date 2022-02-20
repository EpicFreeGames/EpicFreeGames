import { db, embeds, IStats } from "shared";
import { CommandTypes, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language) => {
    await i.deferReply();

    const stats: IStats = {
      guildCount: await db.guilds.get.count(),
      hasWebhook: await db.guilds.get.counts.hasWebhook(),
      hasOnlyChannel: await db.guilds.get.counts.hasOnlySetChannel(),
      hasSetRole: await db.guilds.get.counts.hasSetRole(),
      hasChangedLanguage: await db.guilds.get.counts.hasChangedLanguage(),
    };

    return i.editReply({
      embeds: [embeds.stats(stats)],
    });
  },
};

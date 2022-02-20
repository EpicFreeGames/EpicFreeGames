import { db, embeds, IStats } from "shared";
import { CommandTypes, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language) => {
    await i.deferReply();

    const commandsRanIn = {
      lastHour: await db.logs.commands.get.lastHour(),
      lastDay: await db.logs.commands.get.lastDay(),
      last7days: await db.logs.commands.get.last7days(),
      last30days: await db.logs.commands.get.last30days(),
    };

    const stats: IStats = {
      guildCount: await db.guilds.get.count(),
      hasWebhook: await db.guilds.get.counts.hasWebhook(),
      hasOnlyChannel: await db.guilds.get.counts.hasOnlySetChannel(),
      hasSetRole: await db.guilds.get.counts.hasSetRole(),
      hasChangedLanguage: await db.guilds.get.counts.hasChangedLanguage(),

      commandsRanIn,

      avgCommandsIn: {
        anHour: Math.ceil(commandsRanIn.last30days / 720),
        aDay: Math.ceil(commandsRanIn.last30days / 30),
      },
    };

    return i.editReply({
      embeds: [embeds.stats(stats)],
    });
  },
};

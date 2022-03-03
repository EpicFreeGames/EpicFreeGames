import { db, embeds, IStats, TopTenGuild } from "shared";
import { CommandTypes, SlashCommand } from "shared";
import { getStatsFromClient } from "../utils/stats";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language, currency) => {
    await i.deferReply();

    const clientStats = await getStatsFromClient().catch(() => ({
      guildCount: null,
      topTenGuilds: null,
    }));

    const commandsRanIn = {
      lastHour: await db.logs.commands.get.lastHour(),
      lastDay: await db.logs.commands.get.lastDay(),
      last7days: await db.logs.commands.get.last7days(),
      last30days: await db.logs.commands.get.last30days(),
    };

    const stats: IStats = {
      guildCount: clientStats.guildCount,
      dbGuildCount: await db.guilds.get.count(),
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

    const embedToSend = [embeds.stats(stats)];

    if (clientStats.topTenGuilds) {
      const resolvedGuilds: TopTenGuild[] = [];
      for (const guild of clientStats.topTenGuilds) {
        const dbInfo = await db.guilds.get.one(guild.id);

        resolvedGuilds.push({
          ...guild,
          dbInfo,
        });
      }

      embedToSend.push(embeds.topTenGuilds(resolvedGuilds));
    } else {
      embedToSend.push(
        embeds.generic(
          "Everything is not yet available",
          "More stats will become available once the client has spawned all of it's shards."
        )
      );
    }

    return i.editReply({
      embeds: embedToSend,
    });
  },
};

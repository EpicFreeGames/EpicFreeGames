import { MessageEmbed } from "discord.js";
import {
  CommandInteraction,
  db,
  embeds,
  IStats,
  StatsResponse,
  TopTenGuild,
  ICommandsRanIn,
  CommandTypes,
  SlashCommand,
} from "shared";
import { getStatsFromClient } from "../utils/stats";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language, currency) => {
    await i.deferReply();

    const subCommand = i.getSubCommand(true);

    const clientStats = await getStatsFromClient().catch(() => {
      return {
        guildCount: null,
        topTenGuilds: null,
      };
    });

    if (subCommand?.name === "basic") return basicHandler(i, clientStats);
    if (subCommand?.name === "commands") return commandStatsHandler(i, clientStats);
    if (subCommand?.name === "top10") return topTenGuildsHandler(i, clientStats);
  },
};

const basicHandler = async (i: CommandInteraction, clientStats: StatsResponse) => {
  const stats: IStats = {
    guildCount: clientStats.guildCount,
    dbGuildCount: await db.guilds.get.count(),
    hasWebhook: await db.guilds.get.counts.hasWebhook(),
    hasOnlyChannel: await db.guilds.get.counts.hasOnlySetChannel(),
    hasSetRole: await db.guilds.get.counts.hasSetRole(),
    hasChangedLanguage: await db.guilds.get.counts.hasChangedLanguage(),
  };

  return i.editReply({ embeds: [embeds.stats(stats)] });
};

const commandStatsHandler = async (i: CommandInteraction, clientStats: StatsResponse) => {
  const last30days = await db.logs.commands.get.last30days();

  const commandsRanIn: ICommandsRanIn = {
    lastHour: await db.logs.commands.get.lastHour(),
    lastDay: await db.logs.commands.get.lastDay(),
    last7days: await db.logs.commands.get.last7days(),
    last30days,

    avgCommandsIn: {
      anHour: Math.ceil(last30days / 720),
      aDay: Math.ceil(last30days / 30),
    },
  };

  return i.editReply({ embeds: [embeds.commandsRanIn(commandsRanIn)] });
};

const topTenGuildsHandler = async (i: CommandInteraction, clientStats: StatsResponse) => {
  let embedToSend: MessageEmbed;

  if (clientStats.topTenGuilds) {
    const resolvedGuilds: TopTenGuild[] = [];
    for (const guild of clientStats.topTenGuilds) {
      const dbInfo = await db.guilds.get.one(guild.id);

      resolvedGuilds.push({
        ...guild,
        dbInfo,
      });
    }

    embedToSend = embeds.topTenGuilds(resolvedGuilds);
  } else {
    embedToSend = embeds.generic(
      "All stats not yet available",
      "More stats will become available once the client has spawned all of it's shards."
    );
  }

  return i.editReply({ embeds: [embedToSend] });
};

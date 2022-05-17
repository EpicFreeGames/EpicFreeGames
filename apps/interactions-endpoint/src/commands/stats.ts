import {
  CommandInteraction,
  db,
  embeds,
  IStats,
  ICommandsRanIn,
  CommandTypes,
  SlashCommand,
} from "shared";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language, currency) => {
    await i.deferReply();

    const subCommand = i.getSubCommand(true);

    if (subCommand?.name === "basic") return basicHandler(i);
    if (subCommand?.name === "commands") return commandStatsHandler(i);
  },
};

const basicHandler = async (i: CommandInteraction) => {
  const stats: IStats = {
    dbGuildCount: await db.guilds.get.count(),
    hasWebhook: await db.guilds.get.counts.hasWebhook(),
    hasOnlyChannel: await db.guilds.get.counts.hasOnlySetChannel(),
    hasSetRole: await db.guilds.get.counts.hasSetRole(),
    hasChangedLanguage: await db.guilds.get.counts.hasChangedLanguage(),
    hasChangedCurrency: await db.guilds.get.counts.hasChangedCurrency(),
    hasSetThread: await db.guilds.get.counts.hasSetThread(),
  };

  return i.editReply({ embeds: [embeds.stats(stats)] });
};

const commandStatsHandler = async (i: CommandInteraction) => {
  const last30days = await db.logs.commands.get.last30days();

  const commandsRanIn: ICommandsRanIn = {
    allTime: await db.logs.commands.get.all(),
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

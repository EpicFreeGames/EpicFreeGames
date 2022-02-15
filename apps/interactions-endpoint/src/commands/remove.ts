import { CommandTypes, db, SlashCommand, SubCommandHandler } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.MANAGE_GUILD,
  needsGuild: true,
  execute: async (i, guild, language) => {
    const subCommand = i.getSubCommand(true);

    if (subCommand?.name === "channel") return channelCommand(i, guild, language);
    if (subCommand?.name === "role") return roleCommand(i, guild, language);
  },
};

const channelCommand: SubCommandHandler = async (i, guild, language) => {
  if (guild?.channelId) {
    await db.guilds.remove.webhook(i.guildId!);

    if (guild?.webhook) {
      // TODO: Delete webhook
    }
  }

  return i.reply({ content: "✅", ephemeral: true });
};

const roleCommand: SubCommandHandler = async (i, guild, language) => {
  await db.guilds.remove.role(i.guildId!);

  return i.reply({ content: "✅", ephemeral: true });
};

import { CommandTypes, db, SlashCommand, SubCommandHandler } from "shared";
import { deleteWebhook } from "../utils/webhooks";

export const command: SlashCommand = {
  type: CommandTypes.MANAGE_GUILD,
  needsGuild: true,
  execute: async (i, guild, language, currency) => {
    const subCommand = i.getSubCommand(true);

    if (subCommand?.name === "channel") return channelCommand(i, guild, language, currency);
    if (subCommand?.name === "role") return roleCommand(i, guild, language, currency);
  },
};

const channelCommand: SubCommandHandler = async (i, guild, language, currency) => {
  if (guild?.channelId) {
    await db.guilds.remove.webhook(i.guildId!);

    if (guild?.webhook) await deleteWebhook(guild.webhook);
  }

  return i.reply({ content: "✅", ephemeral: true });
};

const roleCommand: SubCommandHandler = async (i, guild, language, currency) => {
  await db.guilds.remove.role(i.guildId!);

  return i.reply({ content: "✅", ephemeral: true });
};

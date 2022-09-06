import { embeds } from "shared-discord-stuff";
import { SlashCommand, SubCommandHandler } from "shared-discord-stuff";
import { deleteWebhook } from "../utils/webhooks";
import { db } from "database";
import { CommandTypes } from "shared";

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
    const updatedGuild = await db.guilds.remove.webhook(i.guildId!);

    if (guild?.webhook) await deleteWebhook(guild.webhook);

    return i.reply({
      embeds: [
        embeds.success.updatedSettings(language),
        embeds.commands.settings(updatedGuild, language),
      ],
      ephemeral: true,
    });
  }

  return i.reply({
    embeds: [embeds.success.currentSettings(language), embeds.commands.settings(guild, language)],
    ephemeral: true,
  });
};

const roleCommand: SubCommandHandler = async (i, guild, language, currency) => {
  const updatedGuild = await db.guilds.remove.role(i.guildId!);

  if (updatedGuild.roleId === guild?.roleId)
    return i.reply({
      embeds: [embeds.success.currentSettings(language), embeds.commands.settings(guild, language)],
      ephemeral: true,
    });

  return i.reply({
    embeds: [
      embeds.success.updatedSettings(language),
      embeds.commands.settings(updatedGuild, language),
    ],
    ephemeral: true,
  });
};

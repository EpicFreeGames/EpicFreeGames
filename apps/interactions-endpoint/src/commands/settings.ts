import { CommandTypes, embeds, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.MANAGE_GUILD,
  needsGuild: true,
  execute: async (i, guild, language, currency) =>
    i.reply({ embeds: [embeds.commands.settings(guild, language)], ephemeral: true }),
};

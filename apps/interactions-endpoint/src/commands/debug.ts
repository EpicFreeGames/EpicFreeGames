import { CommandTypes, embeds, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.EVERYONE,
  needsGuild: true,
  execute: async (i, guild, language, currency) =>
    i.reply({ embeds: [embeds.commands.debug(i.guildId!)], ephemeral: true }),
};

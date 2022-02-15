import { CommandTypes, embeds, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.EVERYONE,
  execute: async (i, guild, language) => i.reply({ embeds: [embeds.commands.invite(language)] }),
};

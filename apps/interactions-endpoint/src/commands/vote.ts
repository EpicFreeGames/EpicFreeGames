import { embeds, SlashCommand } from "shared-discord-stuff";
import { CommandTypes } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.EVERYONE,
  execute: async (i, guild, language, currency) =>
    i.reply({ embeds: [embeds.commands.vote(language)] }),
};

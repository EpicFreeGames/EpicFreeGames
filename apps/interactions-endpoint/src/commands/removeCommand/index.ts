import { ApplicationCommandOptionType, InteractionType } from "discord-api-types/v10";

import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { SlashCommand } from "../../utils/interactions/types";
import { removeChannelSubCommand } from "./removeChannelSubCommand";
import { removeRoleSubCommand } from "./removeRoleSubCommand";

export const removeCommand: SlashCommand = {
  needsGuild: true,
  needsManageGuild: true,
  execute: async ({ i, ...rest }, res) => {
    if (i.type === InteractionType.ApplicationCommandAutocomplete) return;

    const subCommand = interactionGetTypedOption(i, ApplicationCommandOptionType.Subcommand);

    if (subCommand?.name === "channel") return removeChannelSubCommand({ i, ...rest }, res);
    else if (subCommand?.name === "role") return removeRoleSubCommand({ i, ...rest }, res);
  },
};

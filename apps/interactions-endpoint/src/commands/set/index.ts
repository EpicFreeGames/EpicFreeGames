import { ApplicationCommandOptionType } from "discord-api-types/v10";

import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { SlashCommand } from "../../utils/interactions/types";
import { setChannelCommand } from "./channel";
import { setCurrencyCommand } from "./currency";
import { setLanguageCommand } from "./language";
import { setRoleCommand } from "./role";
import { setThreadCommand } from "./thread";

export const setCommand: SlashCommand = {
  needsGuild: true,
  needsManageGuild: true,
  execute: async (stuff, res) => {
    const subCommand = interactionGetTypedOption(stuff.i, ApplicationCommandOptionType.Subcommand);

    if (subCommand?.name === "channel") return setChannelCommand.execute(stuff, res);
    else if (subCommand?.name === "thread") return setThreadCommand.execute(stuff, res);
    else if (subCommand?.name === "language") return setLanguageCommand.execute(stuff, res);
    else if (subCommand?.name === "role") return setRoleCommand.execute(stuff, res);
    else if (subCommand?.name === "currency") return setCurrencyCommand.execute(stuff, res);
  },
};

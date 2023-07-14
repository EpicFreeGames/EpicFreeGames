import { ApplicationCommandOptionType, InteractionType } from "discord-api-types/v10";

import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { SlashCommand } from "../../utils/interactions/types";
import { setCurrencyAutoCompleteHandler } from "./currency/setCurrencyAutoCompleteHandler";
import { setCurrencySubCommand } from "./currency/setCurrencySubCommand";
import { setLanguageAutoCompleteHandler } from "./language/setLanguageAutoCompleteHandler";
import { setLanguageSubCommand } from "./language/setLanguageSubCommand";
import { setChannelSubCommand } from "./setChannelSubCommand";
import { setRoleSubCommand } from "./setRoleSubCommand";
import { setThreadSubCommand } from "./setThreadSubCommand";

export const setCommand: SlashCommand = {
  needsGuild: true,
  needsManageGuild: true,
  execute: async ({ i, ...rest }, res) => {
    const subCommand = interactionGetTypedOption(i, ApplicationCommandOptionType.Subcommand);

    if (i.type === InteractionType.ApplicationCommandAutocomplete) {
      if (subCommand?.name === "currency") return setCurrencyAutoCompleteHandler(i, res);
      else if (subCommand?.name === "language") return setLanguageAutoCompleteHandler(i, res);

      return;
    } else {
      if (subCommand?.name === "channel") return setChannelSubCommand({ i, ...rest }, res);
      else if (subCommand?.name === "thread") return setThreadSubCommand({ i, ...rest }, res);
      else if (subCommand?.name === "language") return setLanguageSubCommand({ i, ...rest }, res);
      else if (subCommand?.name === "role") return setRoleSubCommand({ i, ...rest }, res);
      else if (subCommand?.name === "currency") return setCurrencySubCommand({ i, ...rest }, res);
    }
  },
};

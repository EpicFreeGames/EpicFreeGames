import { ApplicationCommandOptionType } from "discord-api-types/v10";

import { interactionGetTypedOption } from "./interactionGetTypedOption";

export const interactionGetCommandName = (i: any) => {
  const subCommand = interactionGetTypedOption(i, ApplicationCommandOptionType.Subcommand);
  return subCommand ? `/${i.data.name} ${subCommand.name}` : `/${i.data.name}`;
};

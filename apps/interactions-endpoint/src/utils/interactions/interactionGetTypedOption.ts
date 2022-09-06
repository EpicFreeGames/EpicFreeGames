import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataBasicOption,
  APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
} from "discord-api-types/v10";

export const interactionGetTypedOption = <
  TReturnValue extends APIApplicationCommandInteractionDataBasicOption
>(
  i: APIChatInputApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction,
  type: ApplicationCommandOptionType,
  name?: string
) => {
  if (!i.data.options) return null;

  for (const option of i.data.options) {
    if (option.type === ApplicationCommandOptionType.Subcommand) {
      if (!option.options) continue;

      for (const subOption of option.options) {
        if (subOption.type !== type) continue;
        if (name && subOption.name !== name) continue;

        return subOption as TReturnValue;
      }
    } else if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
      if (!option.options) continue;

      for (const subCommand of option.options) {
        if (!subCommand.options) continue;

        for (const subCommandOption of subCommand.options) {
          if (subCommandOption.type !== type) continue;
          if (name && subCommandOption.name !== name) continue;

          return subCommandOption as TReturnValue;
        }
      }
    } else if (option.type === type) {
      if (name && option.name !== name) continue;

      return option as TReturnValue;
    } else return null;
  }

  return null;
};

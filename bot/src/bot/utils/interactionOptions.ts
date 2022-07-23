import {
  ApplicationCommandOptionTypes,
  Interaction,
  snowflakeToBigint,
} from "discordeno";

export const getChannelId = (
  i: Interaction,
  name: string
): bigint | null | undefined => {
  let res = null;
  if (!i?.data?.options) return null;

  for (const option of i.data.options) {
    if (
      option.type === ApplicationCommandOptionTypes.Channel &&
      option.name === name
    ) {
      res = option.value;
      break;
    }

    if (!option.options) continue;

    for (const subOption of option.options) {
      if (
        subOption.type === ApplicationCommandOptionTypes.Channel &&
        subOption.name === name
      ) {
        res = subOption.value;
        break;
      }
    }
  }

  return snowflakeToBigint(String(res));
};

export const getRoleId = (
  i: Interaction,
  name: string
): bigint | null | undefined => {
  let res = null;
  if (!i?.data?.options) return null;

  for (const option of i.data.options) {
    if (
      option.type === ApplicationCommandOptionTypes.Role &&
      option.name === name
    ) {
      res = option.value;
      break;
    }

    if (!option.options) continue;

    for (const subOption of option.options) {
      if (
        subOption.type === ApplicationCommandOptionTypes.Role &&
        subOption.name === name
      ) {
        res = subOption.value;
        break;
      }
    }
  }

  return snowflakeToBigint(String(res));
};

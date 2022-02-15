import { MessageEmbed } from "discord.js";
import { translate } from "../localisation";
import { Languages } from "../localisation/languages";
import { utils } from "./utils";

export const channelSet = (channelId: string, language: Languages) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description:
      translate("successfully_set_channel_description", language, { channelId }) +
      utils.footer(language),
  });

export const roleSet = (roleId: string, language: Languages) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description: translate("successfully_set_role_description", language, { role: roleId }),
  });

import { MessageEmbed } from "discord.js";
import { translate, Languages } from "../localisation";
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

export const languageSet = (language: Languages) =>
  new MessageEmbed({
    title: translate("language_successfully_set_title", language, {
      language: language,
    }),
    color: "GREEN",
    description: translate("language_successfully_set_description", language),
  });

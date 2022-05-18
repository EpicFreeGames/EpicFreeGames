import { MessageEmbed } from "discord.js";
import { ILanguage } from "../data/types";
import { t } from "../localisation";
import { utils } from "./utils";

// prettier-ignore
export const channelSet = (channelId: string, language: ILanguage) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description: 
      t("channel_thread_set_success_desc", language, { channelId }) + 
      "\n\n" +
      utils.bold(t("updated_settings", language))
  });

// prettier-ignore
export const roleSet = (role: string, language: ILanguage) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description: 
      t("role_set_success_desc", language, { role }) + 
      "\n\n" +
      utils.bold(t("updated_settings", language))
  });

export const updatedSettings = (language: ILanguage) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description: utils.bold(t("updated_settings", language)),
  });

export const currentSettings = (language: ILanguage) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description: utils.bold(t("current_settings", language)),
  });

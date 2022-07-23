import { Embed } from "discordeno";
import { t } from "../i18n/translate.ts";
import { Language } from "../types.ts";
import { colors, utils } from "./embedUtils.ts";

// prettier-ignore
export const channelSet = (channelId: bigint, language: Language):Embed =>
  ({
    title: "✅",
    color: colors.green,
    description: 
      t(language,"channel_thread_set_success_desc", { channel: `<#${channelId}>` }) + 
      "\n\n" +
      utils.bold(t(language,"updated_settings"))
  });

// prettier-ignore
export const roleSet = (role: string, language: Language):Embed =>
  ({
    title: "✅",
    color: colors.green,
    description: 
      t(language,"role_set_success_desc", { role }) + 
      "\n\n" +
      utils.bold(t(language,"updated_settings", ))
  });

export const updatedSettings = (language: Language): Embed => ({
  title: "✅",
  color: colors.gray,
  description: utils.bold(t(language, "updated_settings")),
});

export const currentSettings = (language: Language): Embed => ({
  title: "✅",
  color: colors.gray,
  description: utils.bold(t(language, "current_settings")),
});

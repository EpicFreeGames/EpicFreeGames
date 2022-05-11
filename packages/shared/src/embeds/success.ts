import { MessageEmbed } from "discord.js";
import { translate, Languages, LanguagesWithFlags } from "../localisation";
import { utils } from "./utils";

// prettier-ignore
export const channelSet = (channelId: string, language: Languages) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description:
      translate(`channelSetDesc.${language}`, { channelId }) +
      utils.footer(language),
  });

// prettier-ignore
export const roleSet = (role: string, language: Languages) =>
  new MessageEmbed({
    title: "✅",
    color: "GREEN",
    description:
      translate(`roleSetDesc.${language}`, { role }) +
      utils.footer(language),
  });

// prettier-ignore
export const languageSet = (language: Languages) =>
  new MessageEmbed({
    title: translate(`languageSetTitle.${language}`, { language: LanguagesWithFlags[language] }),
    color: "GREEN",
    description:
      translate(`languageSetDesc.${language}`) +
      utils.footer(language),
  });

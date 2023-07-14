import { botConstants } from "@efg/configuration";
import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  color: embedUtils.colors.gray,
  title: t({ language, key: "help" }),
  description:
    `👋 ${t({ language, key: "help_desc" })}` +
    "\n\n" +
    `📋 ${t({
      language,
      key: "looking_for_commands",
      vars: { commandsLink: botConstants.website.commands },
    })}` +
    "\n\n" +
    `🎮 ${t({
      language,
      key: "how_to_tutorial",
      vars: { tutorialLink: botConstants.website.tutorial },
    })}` +
    "\n\n" +
    `⁉️ ${t({
      language,
      key: "having_problems",
      vars: { serverInvite: botConstants.website.serverInvite },
    })}` +
    "\n\n" +
    `🚩 ${embedUtils.bold(
      t({ language, key: "would_you_like_to_translate", vars: { botName: "EpicFreeGames" } })
    )}` +
    "\n" +
    `- ${t({
      language,
      key: "if_would_like_to_translate",
      vars: { serverInvite: botConstants.website.serverInvite },
    })}` +
    embedUtils.footer(language),
});

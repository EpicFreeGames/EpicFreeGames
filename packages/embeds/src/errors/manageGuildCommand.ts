import { botConstants } from "@efg/configuration";
import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  title: "❌",
  color: embedUtils.colors.red,
  description:
    t({ language, key: "manage_guild_needed" }) +
    "\n\n" +
    t({
      language,
      key: "support_click_here",
      vars: { serverInvite: botConstants.website.serverInvite },
    }) +
    embedUtils.footer(language),
});

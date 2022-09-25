import { botConstants } from "@efg/configuration";
import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  title: t({ language, key: "too_many_webhooks" }),
  color: embedUtils.colors.red,
  description:
    t({ language, key: "ten_webhooks_only" }) +
    "\n\n" +
    t({
      language,
      key: "support_click_here",
      vars: { serverInvite: botConstants.website.serverInvite },
    }) +
    embedUtils.footer(language),
});

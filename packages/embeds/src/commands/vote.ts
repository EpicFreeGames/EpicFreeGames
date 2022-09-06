import { botConstants } from "@efg/configuration";
import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  title: t({ language, key: "vote" }),
  color: embedUtils.colors.gray,
  description:
    Object.entries(botConstants.voteLinks)
      .map(([name, link]) => `${embedUtils.bold(name)}\n${link}`)
      .join("\n\n") + embedUtils.footer(language),
});

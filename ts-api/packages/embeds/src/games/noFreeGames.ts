import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  title: t({ language, key: "no_free_games" }),
  color: embedUtils.colors.red,
  description: ":(" + embedUtils.footer(language),
});

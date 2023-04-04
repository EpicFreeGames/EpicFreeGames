import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  title: "❌",
  color: embedUtils.colors.red,
  description: t({ language, key: "set_channel_first" }) + embedUtils.footer(language),
});

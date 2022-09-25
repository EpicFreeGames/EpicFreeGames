import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  title: "✅",
  color: embedUtils.colors.green,
  description: embedUtils.bold(t({ language, key: "updated_settings" })),
});

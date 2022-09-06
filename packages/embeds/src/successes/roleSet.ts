import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (role: string, language: ILanguage): IEmbed => ({
  title: "✅",
  color: embedUtils.colors.green,
  description:
    t({ language, key: "role_set_success_desc", vars: { role } }) +
    "\n\n" +
    embedUtils.bold(t({ language, key: "updated_settings" })),
});

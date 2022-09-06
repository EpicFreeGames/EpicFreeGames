import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (channelId: bigint, language: ILanguage): IEmbed => ({
  title: "✅",
  color: embedUtils.colors.green,
  description:
    t({ language, key: "channel_thread_set_success_desc", vars: { channel: `<#${channelId}>` } }) +
    "\n\n" +
    embedUtils.bold(t({ language, key: "updated_settings" })),
});

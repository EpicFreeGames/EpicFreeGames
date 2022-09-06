import { t } from "@efg/i18n";
import { ICurrency, IEmbed, ILanguage, IServer } from "@efg/types";

import { embedUtils } from "../_utils";

export default (
  server: IServer | undefined | null,
  language: ILanguage,
  currency: ICurrency
): IEmbed => ({
  title: t({ language, key: "settings" }),
  color: embedUtils.colors.gray,
  description:
    embedUtils.bold(`${t({ language, key: "channel" })}/${t({ language, key: "thread" })}:\n`) +
    showChannelOrThread(server, language) +
    "\n\n" +
    embedUtils.bold(`${t({ language, key: "role" })}:\n`) +
    showRole(server, language) +
    "\n\n" +
    embedUtils.bold(`${t({ language, key: "language" })}:\n`) +
    language.nativeName +
    "\n\n" +
    embedUtils.bold(`${t({ language, key: "currency" })}:\n`) +
    currency.name +
    embedUtils.footer(language),
});

const showChannelOrThread = (server: IServer | undefined | null, language: ILanguage) => {
  if (server?.threadId) {
    return `<#${server?.threadId}>`;
  } else if (server?.channelId) {
    return `<#${server?.channelId}>`;
  } else {
    return t({ language, key: "channel_thread_not_set" });
  }
};

const showRole = (server: IServer | undefined | null, language: ILanguage) => {
  if (server?.roleId) {
    if (server.roleId === "1") return "@everyone";

    return `<@&${server?.roleId}>`;
  } else {
    return t({ language, key: "role_not_set" });
  }
};

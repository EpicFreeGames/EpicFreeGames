import { t } from "@efg/i18n";
import { ICurrency, IEmbed, ILanguage, IServer } from "@efg/types";

import { embedUtils } from "../_utils";

export default (
  server: IServer | undefined | null,
  language: ILanguage,
  currency: ICurrency
): IEmbed => {
  const embedLanguage = server?.language || language;
  const embedCurrency = server?.currency || currency;

  return {
    title: t({ language: embedLanguage, key: "settings" }),
    color: embedUtils.colors.gray,
    description:
      embedUtils.bold(
        `${t({ language: embedLanguage, key: "channel" })}/${t({
          language: embedLanguage,
          key: "thread",
        })}:\n`
      ) +
      showChannelOrThread(server, embedLanguage) +
      "\n\n" +
      embedUtils.bold(`${t({ language: embedLanguage, key: "role" })}:\n`) +
      showRole(server, embedLanguage) +
      "\n\n" +
      embedUtils.bold(`${t({ language: embedLanguage, key: "language" })}:\n`) +
      embedLanguage.nativeName +
      "\n\n" +
      embedUtils.bold(`${t({ language: embedLanguage, key: "currency" })}:\n`) +
      embedCurrency.name +
      embedUtils.footer(embedLanguage),
  };
};

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

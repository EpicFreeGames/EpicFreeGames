import { botConstants } from "@efg/configuration";
import { t } from "@efg/i18n";
import { IEmbed, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (language: ILanguage): IEmbed => ({
  title: t({ language, key: "invite" }),
  color: embedUtils.colors.gray,
  image: {
    url: botConstants.inviteGif,
  },
  description: botConstants.website.botInvite + "\n\n" + t({ language, key: "thank_you" }),
});

import { IEmbed } from "@efg/types";

import { embedUtils } from "../_utils";

export default (guildId: string): IEmbed => ({
  title: "Debug info",
  color: embedUtils.colors.gray,
  description: embedUtils.bold(`Guild ID: ${guildId}`),
});

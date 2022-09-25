import { IEmbed } from "@efg/types";

import { embedUtils } from "../_utils";

export default (): IEmbed => ({
  title: "Error",
  color: embedUtils.colors.red,
  description: "An error occured. :( Please try again later.",
});

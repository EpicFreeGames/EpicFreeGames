import { configuration } from "@efg/configuration";
import { logger } from "@efg/logger";
import { discordApi, objToStr } from "@efg/shared-utils";

import { commands } from "./commands";

(async () => {
  logger.info("Overwriting global slash commands...");

  const { error } = await discordApi(
    {
      method: "PUT",
      path: `/applications/${configuration.DISCORD_CLIENT_ID}/commands`,
      body: commands,
    },
    { useProxy: false }
  );

  if (error) {
    logger.error(
      ["Failed to overwrite global slash commands", `Cause: ${objToStr(error)}`].join("\n")
    );

    process.exit(1);
  }

  logger.info("Global slash commands updated");

  process.exit(0);
})();

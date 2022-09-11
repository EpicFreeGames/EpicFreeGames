import { configuration } from "@efg/configuration";
import { logger } from "@efg/logger";
import { discordApi } from "@efg/shared-utils";

import { commands } from "./commands";

(async () => {
  logger.info("Overwriting global slash commands...");

  await discordApi({
    method: "PUT",
    path: `/applications/${configuration.DISCORD_BOT_ID}/commands`,
    body: commands,
  });

  logger.info("Global slash commands updated");

  process.exit(0);
})();

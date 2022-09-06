import { config } from "config";
import { db } from "database";
import { createApp } from "./app";
import { initTranslations, logger } from "shared-discord-stuff";

(async () => {
  await db.connect(config.mongoUrl);
  console.log("Connected to database (i-endpoint)");

  console.log("Initializing translations");
  await initTranslations();
  console.log("Translations initialized");

  const app = createApp();

  console.log(`Running in ${config.prod ? "PROD" : "DEV"}`);

  app.listen(config.interactionsPort, () => {
    console.log(`Listening for interactions on port ${config.interactionsPort}`);
    logger.info("Interactions endpoint ready");
  });
})();

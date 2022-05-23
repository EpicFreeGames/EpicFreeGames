import { config } from "config";
import { createApp } from "./app";
import { db } from "database";
import { initTranslations } from "shared-discord-stuff";

(async () => {
  await db.connect(config.mongoUrl);
  console.log("Connected to database (sender)");

  console.log("Initialising translations (sender)");
  await initTranslations();
  console.log("Translations initialised (sender)");

  const app = createApp();

  app.listen(config.senderPort, () => console.log(`Sender listening on port ${config.senderPort}`));
})();

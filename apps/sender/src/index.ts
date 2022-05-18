import { config } from "config";
import { createApp } from "./app";
import { db } from "database";

(async () => {
  await db.connect(config.mongoUrl);
  console.log("Connected to database (sender)");

  const app = createApp();

  app.listen(config.senderPort, () => console.log(`Sender listening on port ${config.senderPort}`));
})();

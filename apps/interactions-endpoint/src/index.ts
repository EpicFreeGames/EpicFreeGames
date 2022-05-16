import mongoose from "mongoose";
import { config } from "config";
import { createApp } from "./app";
import { initTranslations, logger } from "shared";

(async () => {
  await mongoose.connect(config.mongoUrl);
  console.log("Connected to database (i-endpoint)");

  await initTranslations();

  const app = createApp();

  console.log(`Running in ${config.prod ? "PROD" : "DEV"}`);

  app.listen(config.interactionsPort, () => {
    console.log(`Listening for interactions on port ${config.interactionsPort}`);
    logger.info("Interactions endpoint ready");
  });
})();

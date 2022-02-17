import mongoose from "mongoose";
import { config } from "config";
import { createApp } from "./app";

(async () => {
  await mongoose.connect(config.mongoUrl);
  console.log("Connected to database");

  const app = createApp();

  console.log(`Running in ${config.prod ? "PROD" : "DEV"}`);

  app.listen(config.interactionsPort, () => {
    console.log(`I-endpoint listening on port ${config.interactionsPort}`);
  });
})();

import { config } from "config";
import mongoose from "mongoose";
import { createApp } from "./app";

async () => {
  await mongoose.connect(config.mongoUrl);
  console.log("Database connected (sender)");

  const app = createApp();

  app.listen(config.senderPort, () => console.log(`Sender listening on port ${config.senderPort}`));
};

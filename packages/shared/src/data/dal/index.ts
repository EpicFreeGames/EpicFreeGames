import { config } from "config";
import mongoose from "mongoose";

export * as games from "./games";
export * as guilds from "./guilds";
export * as logs from "./logs";

export const connect = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(config.mongoUrl);
  }
};

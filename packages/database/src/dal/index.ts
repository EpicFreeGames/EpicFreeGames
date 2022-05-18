import mongoose from "mongoose";

export * as games from "./games";
export * as guilds from "./guilds";
export * as logs from "./logs";
export * as languages from "./languages";
export * as currencies from "./currencies";

export const connect = async (connectionUrl: string) => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(connectionUrl);
  }
};

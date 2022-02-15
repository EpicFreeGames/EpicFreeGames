import { config } from "config";
import { verifyKeyMiddleware } from "discord-interactions";
import express from "express";

export const createApp = () => {
  const app = express();
  app.set("trust proxy", "loopback");

  app.post("/interactions", verifyKeyMiddleware(config.botPublicKey));

  return app;
};

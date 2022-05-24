import { config } from "config";
import { verifyKeyMiddleware } from "discord-interactions";
import express from "express";
import { handleRequests } from "./handleRequest";
import { updateTranslations } from "./update-translations";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.set("trust proxy", "loopback");

  app.post("/interactions", verifyKeyMiddleware(config.botPublicKey), handleRequests);
  app.post("/update-translations", updateTranslations);

  return app;
};

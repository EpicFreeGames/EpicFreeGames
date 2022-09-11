import { verifyKeyMiddleware } from "discord-interactions";
import express from "express";

import { configuration } from "@efg/configuration";

import { handleRequest } from "./handleRequest";

export const createServer = () => {
  const app = express();
  app.set("trust proxy", "loopback");

  app.post("/interactions", verifyKeyMiddleware(configuration.DISCORD_PUBLIC_KEY), handleRequest);

  return app;
};

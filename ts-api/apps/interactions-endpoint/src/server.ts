import { verifyKeyMiddleware } from "discord-interactions";
import express from "express";

import { configuration } from "@efg/configuration";

import { handleRequests } from "./handleRequest";

export const createServer = () => {
  const app = express();
  app.set("trust proxy", "loopback");

  app.post("/", verifyKeyMiddleware(configuration.DISCORD_PUBLIC_KEY), handleRequests);

  return app;
};

import { logger } from "~logger";
import { bot } from "../mod.ts";
import { interactionCreateHandler } from "./interactionCreate.ts";
import { readyEventHandler } from "./ready.ts";

export const initEvents = () => {
  logger.info("Initializing events");

  bot.events.interactionCreate = interactionCreateHandler;
  bot.events.ready = readyEventHandler;
};

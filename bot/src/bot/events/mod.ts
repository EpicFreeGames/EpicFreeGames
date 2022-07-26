import { logger } from "~shared/utils/logger.ts";
import { bot } from "../mod.ts";
import { interactionCreateHandler } from "./interactionCreate.ts";
import { readyEventHandler } from "./ready.ts";

export const initEvents = () => {
  logger.info("Initializing events");

  bot.events.interactionCreate = interactionCreateHandler;
  bot.events.ready = readyEventHandler;
};

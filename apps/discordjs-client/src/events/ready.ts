import { config } from "config";
import { logger, rightMongo } from "shared";
import { expressServer } from "../express";
import { IClient, IEvent } from "../types";
import { getGuildCount, statsToTopGG, updatePresence } from "../utils";

export const event: IEvent = {
  once: true,
  async execute(client: IClient) {
    logger.console("Ready event");
    logger.info("Ready event");

    await updatePresence(client);

    // check for the last cluster
    if (client.cluster.id !== client.cluster.count - 1) return;

    logger.info("**Last shard spawned**");

    await rightMongo.connect(config.mongoUrl);
    console.log("Connected to database");

    expressServer(client);

    setTimeout(
      async () => statsToTopGG(await getGuildCount(client)).catch((err) => console.error(err)),
      1000 * 60 * 30
    );

    setInterval(() => updatePresence(client), 1000 * 60);
    setInterval(async () => statsToTopGG(await getGuildCount(client)), 1000 * 60 * 60 * 24);
  },
};

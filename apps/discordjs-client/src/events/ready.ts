import { config } from "config";
import { logger, rightMongo } from "shared";
import { IClient, IEvent } from "../types";
import { getGuildCount, statsToTopGG, updatePresence } from "../utils";

export const event: IEvent = {
  once: true,
  async execute(client: IClient) {
    logger.console("Ready event");

    // check for the last cluster
    if (client.cluster.id !== client.cluster.count - 1) return;

    await rightMongo.connect(config.mongoUrl);
    console.log("Connected to database");

    const guildCount = await getGuildCount(client);

    await updatePresence(client);
    await statsToTopGG(guildCount).catch((err) => console.error(err));
    setInterval(() => updatePresence(client), 1000 * 60);
    setInterval(() => statsToTopGG(guildCount), 1000 * 60 * 60 * 24);
  },
};

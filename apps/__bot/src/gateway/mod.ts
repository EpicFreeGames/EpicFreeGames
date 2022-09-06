import {
  DiscordGatewayPayload,
  createGatewayManager,
  createRestManager,
  routes,
  transformGatewayBot,
} from "discordeno";

import { sharedConfig } from "~shared/sharedConfig.ts";
import { logger } from "~shared/utils/logger.ts";

import { gatewayConfig } from "./config.ts";

const queue: GatewayQueue = {
  processing: false,
  events: [],
};

export interface QueuedEvent {
  data: DiscordGatewayPayload;
  shardId: number;
}

export interface GatewayQueue {
  processing: boolean;
  events: QueuedEvent[];
}

async function handleQueue() {
  const event = queue.events.shift();
  // QUEUE IS EMPTY
  if (!event) {
    logger.debug("GATEWAY QUEUE EMPTY");
    queue.processing = false;
    return;
  }

  await fetch(`${gatewayConfig.EVENT_HANDLER_URL}`, {
    method: "POST",
    body: JSON.stringify({
      shardId: event.shardId,
      data: event.data,
    }),
  })
    .then((res) => {
      res.text();
      handleQueue();
    })
    .catch(() => {
      queue.events.unshift(event);
      setTimeout(handleQueue, 1000);
    });
}

const rest = createRestManager({
  token: sharedConfig.BOT_TOKEN,
  customUrl: sharedConfig.REST_PROXY_URL,
});

logger.info("Getting gateway data...");

const gatewayData = await rest.runMethod(rest, "GET", routes.GATEWAY_BOT()).catch((err) => {
  logger.error("error getting gateway data", err);

  Deno.exit(0);
});

logger.info("Got gateway data", gatewayData);

const gateway = createGatewayManager({
  gatewayBot: transformGatewayBot(gatewayData),
  gatewayConfig: {
    token: sharedConfig.BOT_TOKEN,
    intents: sharedConfig.INTENTS,
  },
  handleDiscordPayload: async ({ id: shardId }, data) => {
    logger.debug("GATEWAY EVENT", data.t);

    if (queue.processing && data.t !== "INTERACTION_CREATE")
      return queue.events.push({ shardId, data });

    logger.debug(`Sending gateway event to event handler @ ${gatewayConfig.EVENT_HANDLER_URL}`);

    await fetch(`${gatewayConfig.EVENT_HANDLER_URL}`, {
      method: "POST",
      body: JSON.stringify({ shardId, data }),
    })
      .then((res) => res.text())
      .catch(() => {
        if (data.t !== "INTERACTION_CREATE") queue.events.push({ shardId, data });
        setTimeout(handleQueue, 1000);
      });
  },
});

logger.info("Spawning shards...");

gateway.spawnShards();

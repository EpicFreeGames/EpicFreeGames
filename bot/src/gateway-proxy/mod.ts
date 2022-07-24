import {
  createGatewayManager,
  createRestManager,
  DiscordGatewayPayload,
  routes,
  transformGatewayBot,
} from "discordeno";
import { config } from "../config.ts";
import { logger } from "../utils/logger.ts";

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
    console.log("GATEWAY QUEUE ENDING");
    queue.processing = false;
    return;
  }

  await fetch(`${config.BOT_URL}`, {
    headers: {
      Authorization: config.BOT_AUTH,
      "Content-Type": "application/json",
    },
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
  token: config.BOT_TOKEN,
  secretKey: config.REST_PROXY_AUTH,
  customUrl: config.REST_PROXY_URL,
});

const gatewayData = await rest.runMethod(rest, "GET", routes.GATEWAY_BOT());

const gateway = createGatewayManager({
  gatewayBot: transformGatewayBot(gatewayData),
  gatewayConfig: {
    token: config.BOT_TOKEN,
    intents: config.Intents,
  },
  handleDiscordPayload: async ({ id: shardId }, data) => {
    logger.debug("GATEWAY EVENT", data.t);

    if (queue.processing && data.t !== "INTERACTION_CREATE")
      return queue.events.push({ shardId, data });

    await fetch(`${config.BOT_URL}`, {
      headers: {
        Authorization: config.BOT_AUTH,
      },
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

gateway.spawnShards();

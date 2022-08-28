import { DiscordGatewayPayload, createBot } from "discordeno";

import { handleCache } from "~shared/cache.ts";
import { connectRedis } from "~shared/redis.ts";
import { sharedConfig } from "~shared/sharedConfig.ts";
import { botRest } from "~shared/utils/botRest.ts";
import { logger } from "~shared/utils/logger.ts";

import { initI18n } from "../_shared/i18n/index.ts";
import { initCommands } from "./commands/mod.ts";
import { eventHandlerConfig } from "./config.ts";
import { initEvents } from "./events/mod.ts";

export const bot = handleCache(
  createBot({
    token: sharedConfig.BOT_TOKEN,
    botId: sharedConfig.BOT_ID,
    intents: sharedConfig.INTENTS,
  })
);

bot.rest = botRest;

initEvents();
initCommands();
await initI18n();

await connectRedis();

const port = Number(Deno.env.get("PORT")) || 3000;

const httpServer = Deno.listen({ port });
logger.info(`Bot listening for events on port ${port}`);

for await (const conn of httpServer) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);

    for await (const requestEvent of httpConn) {
      if (
        eventHandlerConfig.EVENT_HANDLER_AUTH !== requestEvent.request.headers.get("AUTHORIZATION")
      ) {
        return requestEvent.respondWith(
          new Response(JSON.stringify({ error: "Invalid secret key." }), {
            status: 401,
          })
        );
      }

      if (requestEvent.request.method !== "POST") {
        return requestEvent.respondWith(
          new Response(JSON.stringify({ error: "Method not allowed." }), {
            status: 405,
          })
        );
      }

      const json = (await requestEvent.request.json()) as {
        data: DiscordGatewayPayload;
        shardId: number;
      };

      logger.debug("Received an event", json.data.t);

      bot.events.raw(bot, json.data, json.shardId);

      if (json.data.t && json.data.t !== "RESUMED") {
        if (!["READY", "GUILD_LOADED_DD"].includes(json.data.t)) {
          await bot.events.dispatchRequirements(bot, json.data, json.shardId);
        }

        bot.handlers[json.data.t]?.(bot, json.data, json.shardId);
      }

      requestEvent.respondWith(
        new Response(undefined, {
          status: 204,
        })
      );
    }
  })();
}

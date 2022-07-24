import { createBot, createRestManager, DiscordGatewayPayload } from "discordeno";
import { connect } from "https://deno.land/x/redis@v0.26.0/redis.ts";
import { logger } from "~logger";
import { config } from "../config.ts";
import { commands, initCommands } from "./commands/mod.ts";
import { initEvents } from "./events/mod.ts";
import { handleCache } from "./utils/cache.ts";

export const bot = handleCache(
  createBot({
    token: config.BOT_TOKEN,
    botId: config.BOT_ID,
    intents: config.Intents,
  })
);

bot.rest = createRestManager({
  token: config.BOT_TOKEN,
  secretKey: config.REST_PROXY_AUTH,
  customUrl: config.REST_PROXY_URL,
});

export const redis = await connect({
  hostname: config.REDISHOST,
  port: config.REDISPORT,
});
logger.info("Connected to Redis");

if (config.SLASH_COMMANDS) {
  await bot.helpers
    .upsertApplicationCommands(
      commands.map((c) => ({
        name: c.name,
        description: c.description,
        options: c.options,
        type: c.type,
      }))
    )
    .then(() => logger.info("Commands updated."))
    .catch((err) => logger.error("Error updating slash commands:", err));
}

initEvents();
initCommands();

const httpServer = Deno.listen({ port: 3000 });
logger.info("🚀 Bot listening for events on port 3000");

for await (const conn of httpServer) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);

    for await (const requestEvent of httpConn) {
      if (
        !config.BOT_AUTH ||
        config.BOT_AUTH !== requestEvent.request.headers.get("AUTHORIZATION")
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

      logger.debug("GATEWAY EVENT", json.data.t);

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

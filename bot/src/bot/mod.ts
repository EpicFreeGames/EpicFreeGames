import { createBot, DiscordGatewayPayload } from "discordeno";
import { logger } from "~logger";
import { handleCache } from "../cache.ts";
import { config } from "../config.ts";
import { connectRedis } from "../redis.ts";
import { botRest } from "../utils/botRest.ts";
import { commands, initCommands } from "./commands/mod.ts";
import { initEvents } from "./events/mod.ts";

export const bot = handleCache(
  createBot({
    token: config.BOT_TOKEN,
    botId: config.BOT_ID,
    intents: config.Intents,
  })
);

bot.rest = botRest;

initEvents();
initCommands();

await connectRedis();

if (config.SLASH_COMMANDS) {
  const commandList = commands.map((c) => ({
    name: c.name,
    description: c.description,
    options: c.options,
    type: c.type,
  }));

  await bot.helpers
    .upsertApplicationCommands(commandList)
    .then(() => logger.info("Commands updated."))
    .catch((err) => logger.error("Error updating slash commands:", err));
}

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

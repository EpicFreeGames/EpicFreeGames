import { createBot } from "discordeno";
import { handleCache } from "../cache.ts";
import { config } from "../config.ts";
import { connectRedis } from "../redis.ts";
import { botRest } from "../utils/botRest.ts";
import { logger } from "../utils/logger.ts";
import { send } from "./send.ts";

export const sender = handleCache(
  createBot({
    token: config.BOT_TOKEN,
    botId: config.BOT_ID,
    intents: config.Intents,
  })
);

sender.rest = botRest;

await connectRedis();

const httpServer = Deno.listen({ port: 3000 });
logger.info("Sender listening for events on port 3000");

for await (const conn of httpServer) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);

    for await (const requestEvent of httpConn) {
      if (config.SENDER_AUTH !== requestEvent.request.headers.get("AUTHORIZATION"))
        return requestEvent.respondWith(
          new Response(JSON.stringify({ error: "Invalid secret key." }), {
            status: 401,
          })
        );

      const { sendingId } = await requestEvent.request.json();

      const startedSending = send(sendingId);

      if (!startedSending)
        return requestEvent.respondWith(
          new Response(JSON.stringify({ message: "sending was not started" }), { status: 500 })
        );

      return requestEvent.respondWith(
        new Response(JSON.stringify({ message: "sending started" }), { status: 200 })
      );
    }
  })();
}

import { createBot } from "discordeno";
import { config } from "~config";
import { handleCache } from "~shared/cache.ts";
import { connectRedis } from "~shared/redis.ts";
import { botRest } from "~shared/utils/botRest.ts";
import { logger } from "~shared/utils/logger.ts";
import { api } from "../_shared/api.ts";
import { Server } from "../_shared/types.ts";
import { send } from "./send.ts";
import { filterServers } from "./utils.ts";

export const sender = handleCache(
  createBot({
    token: config.BOT_TOKEN,
    botId: config.BOT_ID,
    intents: config.Intents,
  })
);

sender.rest = botRest;

await connectRedis();

const port = Number(Deno.env.get("PORT")) || 3000;

const httpServer = Deno.listen({ port });
logger.info(`Sender listening for events on port ${port}`);

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

      const { sendingId, games } = await requestEvent.request.json();

      let servers: Server[] = [];

      console.log("getting servers");

      let resServers = await api<Server[]>({
        method: "GET",
        path: `/sends/servers-to-send`,
        query: new URLSearchParams({
          sendingId,
        }),
      });

      while (resServers.data?.length) {
        servers = [...servers, ...resServers.data];
        console.log(servers.length, "servers");

        resServers = await api<Server[]>({
          method: "GET",
          path: `/sends/servers-to-send`,
          query: new URLSearchParams({
            sendingId,
            after: servers.at(-1)?.id + "",
          }),
        });
      }

      const filterResult = filterServers(servers);

      if (filterResult.noServers)
        return requestEvent.respondWith(
          new Response(
            JSON.stringify({
              message: "sending was not started, all servers got filtered out",
              success: false,
            }),
            {
              status: 500,
            }
          )
        );

      send(sendingId, games, filterResult);

      return requestEvent.respondWith(
        new Response(JSON.stringify({ message: "sending started", success: true }), { status: 200 })
      );
    }
  })();
}

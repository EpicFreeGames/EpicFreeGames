import { createBot } from "discordeno";

import { api } from "~shared/api.ts";
import { handleCache } from "~shared/cache.ts";
import { initI18n } from "~shared/i18n/index.ts";
import { connectRedis } from "~shared/redis.ts";
import { sharedConfig } from "~shared/sharedConfig.ts";
import { Server } from "~shared/types.ts";
import { botRest } from "~shared/utils/botRest.ts";
import { logger } from "~shared/utils/logger.ts";

import { senderConfig } from "./config.ts";
import { send } from "./send.ts";
import { filterServers } from "./utils.ts";

export const sender = handleCache(
  createBot({
    token: sharedConfig.BOT_TOKEN,
    botId: sharedConfig.BOT_ID,
    intents: sharedConfig.INTENTS,
  })
);

sender.rest = botRest;

await connectRedis();
await initI18n();

const port = Number(Deno.env.get("PORT")) || 3000;

const httpServer = Deno.listen({ port });
logger.info(`Sender listening for events on port ${port}`);

for await (const conn of httpServer) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);

    for await (const requestEvent of httpConn) {
      if (senderConfig.SENDER_AUTH !== requestEvent.request.headers.get("AUTHORIZATION"))
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

        resServers = await api<Server[]>({
          method: "GET",
          path: `/sends/servers-to-send`,
          query: new URLSearchParams({
            sendingId,
            after: servers.at(-1)?.id + "",
          }),
        });
      }

      console.log(`${sendingId} - got ${servers.length} servers\nSetting new target...`);

      await api<void>({
        method: "PATCH",
        path: `/sends/${sendingId}/target`,
        body: { newTarget: servers.length },
      });

      console.log(`${sendingId} - New target set, filtering servers...`);

      const filterResult = filterServers(servers);

      if (filterResult.noServers) {
        console.log(`${sendingId} - No servers left to send to, aborting...`);

        return requestEvent.respondWith(
          new Response(
            JSON.stringify({
              message: "Sending was not started, all servers got filtered out",
              success: false,
            }),
            {
              status: 500,
            }
          )
        );
      }

      console.log(
        `${sendingId} - Filtering done, starting sending to ${
          filterResult.hookServers.length + filterResult.messageServers.length
        } servers...`
      );

      send(sendingId, games, filterResult);

      return requestEvent.respondWith(
        new Response(JSON.stringify({ message: "sending started", success: true }), { status: 200 })
      );
    }
  })();
}

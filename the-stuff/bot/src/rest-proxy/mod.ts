import { BASE_URL } from "discordeno";

import { RestMethod } from "~shared/types.ts";
import { botRest } from "~shared/utils/botRest.ts";
import { logger } from "~shared/utils/logger.ts";

const rest = botRest;

const port = Number(Deno.env.get("PORT")) || 3000;

const httpServer = Deno.listen({ port });
logger.info(`REST server listening on port ${port}`);

const handleConnection = async (connection: Deno.Conn) => {
  const httpConnection = Deno.serveHttp(connection);

  for await (const requestEvent of httpConnection) {
    const path = new URL(requestEvent.request.url).pathname;
    const proxyTo = `${BASE_URL}${new URL(requestEvent.request.url).pathname}`;

    logger.debug(`Request received to: ${path} - proxying to: ${proxyTo}`);

    const json = await requestEvent.request.json().catch(() => null);

    try {
      const result = await rest.runMethod(
        rest,
        requestEvent.request.method as RestMethod,
        proxyTo,
        json
      );

      logger.debug("result", result);

      if (result) {
        requestEvent.respondWith(
          new Response(JSON.stringify(result), {
            status: 200,
          })
        );
      } else {
        requestEvent.respondWith(
          new Response(undefined, {
            status: 204,
          })
        );
      }
    } catch (err) {
      logger.error(
        `Error while running REST request, more info about request:\nConnection came to: ${
          requestEvent.request.method
        } ${
          requestEvent.request.url
        }\nTried to proxy connection to: ${proxyTo}\nRequest body: ${JSON.stringify(
          json,
          null,
          2
        )}\nError: ${err.stack}`
      );

      requestEvent.respondWith(
        new Response(err.body, {
          status: err.status ?? 500,
        })
      );
    }
  }
};

for await (const conn of httpServer) {
  handleConnection(conn);
}

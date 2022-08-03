import { BASE_URL } from "discordeno";
import { config } from "~config";
import { RestMethod } from "~shared/types.ts";
import { serialize } from "~shared/utils/jsonWorker/initiator.ts";
import { logger } from "~shared/utils/logger.ts";
import { botRest } from "../_shared/utils/botRest.ts";

const rest = botRest;

const port = Number(Deno.env.get("PORT")) || 3000;

const httpServer = Deno.listen({ port });
logger.info(`REST server listening on port ${port}`);

const handleConnection = async (connection: Deno.Conn) => {
  const httpConnection = Deno.serveHttp(connection);

  for await (const requestEvent of httpConnection) {
    if (
      !config.REST_PROXY_AUTH ||
      config.REST_PROXY_AUTH !== requestEvent.request.headers.get("AUTHORIZATION")
    ) {
      return requestEvent.respondWith(
        new Response(JSON.stringify({ error: "Invalid authorization key." }), {
          status: 401,
        })
      );
    }

    const json = await requestEvent.request.json().catch(() => null);

    const proxyTo = `${BASE_URL}${new URL(requestEvent.request.url).pathname}`;

    try {
      const result = await rest.runMethod(
        rest,
        requestEvent.request.method as RestMethod,
        proxyTo,
        json
      );

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
        }\nTried to proxy connection to: ${proxyTo}\nRequest body: ${await serialize(
          json
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

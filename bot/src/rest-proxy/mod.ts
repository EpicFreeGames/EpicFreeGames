import { BASE_URL, createRestManager } from "discordeno";
import { config } from "../config.ts";
import { RestMethod } from "../types.ts";
import { serialize } from "../utils/jsonWorker/initiator.ts";
import { logger } from "../utils/logger.ts";

const rest = createRestManager({
  token: config.BOT_TOKEN,
  secretKey: config.REST_PROXY_AUTH,
  customUrl: config.REST_PROXY_URL,
});

const httpServer = Deno.listen({ port: 3000 });
logger.info("REST server listening on port 3000");

const handleConnection = async (connection: Deno.Conn) => {
  const httpConnection = Deno.serveHttp(connection);

  for await (const requestEvent of httpConnection) {
    if (
      !config.REST_PROXY_AUTH ||
      config.REST_PROXY_AUTH !==
        requestEvent.request.headers.get("AUTHORIZATION")
    ) {
      return requestEvent.respondWith(
        new Response(JSON.stringify({ error: "Invalid authorization key." }), {
          status: 401,
        })
      );
    }

    const json = await requestEvent.request.json().catch(() => null);

    const proxyTo = `${BASE_URL}${requestEvent.request.url.substring(
      rest.customUrl.length
    )}`;

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

      const statusCode = err.message.match(/\(\d+\) /)?.[0].replace(/\D/g, "");

      requestEvent.respondWith(
        new Response(undefined, {
          status: statusCode ?? 500,
        })
      );
    }
  }
};

for await (const conn of httpServer) {
  handleConnection(conn);
}

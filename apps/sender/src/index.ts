import express from "express";
import { z } from "zod";

import { logger } from "@efg/logger";
import { efgApi, objToStr } from "@efg/shared-utils";
import { IServer } from "@efg/types";

import { executeHooks } from "./executeWebhooks";
import { sendMessages } from "./sendMessages";
import { filterServers } from "./utils";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { body } = req;

  const validationResult = await bodySchema.safeParseAsync(body);

  if (!validationResult.success) {
    logger.error(`Failed to validate request body: ${objToStr(validationResult.error.issues)}`);
    return res.status(400).json({ error: validationResult.error.message });
  }

  const { sendingId, games } = validationResult.data;

  let servers: IServer[] = [];

  logger.info(`[${sendingId}] - Received request, getting servers...`);

  let resServers = await efgApi<IServer[]>({
    method: "GET",
    path: `/sends/servers-to-send`,
    query: new URLSearchParams({ sendingId }),
  });

  while (resServers?.data?.length) {
    servers = [...servers, ...resServers.data];

    const lastServer = servers.at(-1);

    resServers = await efgApi<IServer[]>({
      method: "GET",
      path: `/sends/servers-to-send`,
      query: new URLSearchParams({
        sendingId,
        ...(lastServer && { after: lastServer.id }),
      }),
    });
  }

  logger.info(`[${sendingId}] - Got ${servers.length} servers, filtering...`);

  const filterResult = filterServers(servers);

  if (filterResult.noServers) {
    logger.info(`[${sendingId}] - ALl servers got filtered out, stopping`);

    return res
      .status(400)
      .json({ message: "Sending was not started, all servers got filtered out", success: false });
  }

  const serverCount = filterResult.hookServers.length + filterResult.messageServers.length;

  logger.info(
    [
      `[${sendingId}] - Filtering done`,
      `Webhook servers: ${filterResult.hookServers.length}`,
      `Message servers: ${filterResult.messageServers.length}`,
      `Starting sending to ${serverCount} servers...`,
    ].join("\n")
  );

  sendMessages(games, filterResult.messageServers, sendingId);
  executeHooks(games, filterResult.hookServers, sendingId);

  logger.info("Sending started");
  return res.json({ message: "Sending started", success: true, serverCount });
});

const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`Sender listening on port ${port}`));

const bodySchema = z.object({
  sendingId: z.string(),
  games: z.array(
    z.object({
      id: z.string(),
      confirmed: z.boolean(),
      sendingId: z.string(),
      name: z.string(),
      displayName: z.string(),
      imageUrl: z.string(),
      start: z.string(),
      end: z.string(),
      path: z.string(),
      prices: z.array(
        z.object({
          value: z.number(),
          formattedValue: z.string(),
          gameId: z.string(),
          currencyCode: z.string(),
        })
      ),
      storeId: z.string(),
      store: z.object({
        id: z.string(),
        name: z.string(),
        webLinkName: z.string(),
        webBaseUrl: z.string(),
        appLinkName: z.string().nullable(),
        appBaseUrl: z.string().nullable(),
      }),
      redirectWebUrl: z.string(),
      redirectAppUrl: z.string().nullable(),
      webLink: z.string(),
      appLink: z.string(),
      status: z.union([z.literal("up"), z.literal("free"), z.literal("gone")]),
    })
  ),
});

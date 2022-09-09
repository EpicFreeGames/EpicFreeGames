import Bottleneck from "bottleneck";
import express from "express";

import { configuration } from "@efg/configuration";
import { logger } from "@efg/logger";

(async () => {
  const app = express();
  app.use(express.json());

  const limiter = new Bottleneck({
    minTime: 30,
    maxConcurrent: 2,
  });

  app.all("/*", async (req, res) => {
    const { path, method, body } = req;
    const bodyHasProps = Object.keys(body).length > 0;

    const proxyTo = `${configuration.DISCORD_API_BASEURL}${path}`;

    logger.debug(`Requesting ${method} ${proxyTo}`);

    const discordResponse = await limiter.schedule(() =>
      fetch(proxyTo, {
        method,
        headers: {
          Authorization: `Bot ${configuration.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        ...(bodyHasProps && { body: JSON.stringify(body) }),
      })
    );

    const responseBody = await discordResponse.json().catch(() => undefined);

    logger.debug(`Sending response from ${proxyTo} with status ${discordResponse.status}`);

    res.status(discordResponse.status || 500).json(responseBody);
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => logger.info(`Discord-rest-proxy listening on port ${port}`));
})();

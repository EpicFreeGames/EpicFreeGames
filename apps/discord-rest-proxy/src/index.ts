import axios from "axios";
import limitedAxios from "axios-rate-limit";
import express from "express";

import { configuration } from "@efg/configuration";
import { logger } from "@efg/logger";

(async () => {
  const app = express();
  app.use(express.json());

  const thing = limitedAxios(axios.create(), { maxRequests: 15, perMilliseconds: 500 });

  app.all("/*", async (req, res) => {
    const { path, method, body } = req;
    const bodyHasProps = Object.keys(body).length > 0;

    const proxyTo = `${configuration.DISCORD_API_BASEURL}${path}`;

    logger.debug(`Requesting ${method} ${proxyTo}`);

    const discordResponse = await thing({
      method,
      url: proxyTo,
      headers: {
        Authorization: `Bot ${configuration.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      ...(bodyHasProps && { data: body }),
    }).catch((err) => err.response);

    if (!discordResponse || discordResponse.status !== 200) console.log(discordResponse);

    logger.debug(`Sending response from ${proxyTo} with status ${discordResponse.status}`);

    discordResponse.data
      ? res.status(discordResponse.status).json(discordResponse.data)
      : res.status(discordResponse.status).end();
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => logger.info(`Discord-rest-proxy listening on port ${port}`));
})();

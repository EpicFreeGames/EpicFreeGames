import { config } from "config";
import express from "express";
import { IClient } from "./types";
import { getGuildCount, getTopTenGuilds } from "./utils";

export const expressServer = (client: IClient) => {
  const app = express();

  app.use(express.json());

  app.get("/stats", async (req, res) => {
    const guildCount = await getGuildCount(client);
    const topTenGuilds = await getTopTenGuilds(client);
    console.log(
      `stats was requested, returned guildCount: ${guildCount} and topTenGuilds: ${topTenGuilds.length} guilds`
    );

    res.status(200).json({ guildCount, topTenGuilds });
  });

  app.listen(config.clientPort, () => {
    console.log(`Listening on port ${config.clientPort}`);
  });
};

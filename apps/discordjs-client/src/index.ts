import Cluster from "discord-hybrid-sharding";
import path, { dirname } from "path";
import { logger } from "shared";
import { config } from "config";
import { fileURLToPath } from "url";

const manager = new Cluster.Manager(
  path.resolve(process.cwd(), dirname(fileURLToPath(import.meta.url)), "./bot.js"),
  {
    token: config.botToken,
    shardsPerClusters: 10,
    mode: "process",
    execArgv: ["--experimental-specifier-resolution=node"],
    keepAlive: {
      interval: 2000,
      maxMissedHeartbeats: 5,
      maxClusterRestarts: 3,
    },
  }
);

logger.console("Bot started");

manager.on("clusterCreate", (cluster) => {
  logger.console(`Cluster ${cluster.id} created`);
});

manager.spawn({ timeout: -1 });

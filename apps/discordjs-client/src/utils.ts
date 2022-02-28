import { db, timeString, logger } from "shared";
import fetch from "node-fetch";
import { IClient } from "./types";
import { config } from "config";

export const getGuildCount = async (c: IClient) => {
  const res = await c.cluster.broadcastEval((c: any) => {
    return c.guilds.cache.size;
  });

  return res.reduce((a, b) => a + b, 0);
};

export const getTimeToClosestGame = async () => {
  let games = await db.games.get.upcoming();

  if (!games.length) return null;

  games = games.sort((a, b) => a.start - b.start);

  const ms = games[0].start;

  return timeString(ms - Date.now(), true);
};

export const updatePresence = async (c: IClient) => {
  const timeUntilNext = await getTimeToClosestGame();

  logger.console(`Updating presence: ${timeUntilNext}`);

  // prettier-ignore
  c.cluster?.broadcastEval(
    (c: any, { timeUntilNext }) => {
      c.user?.setPresence({
        activities: [{ name: `/help ${timeUntilNext ? `| ${timeUntilNext}`: ""}`, type: "WATCHING" }],
        status: "online",
      });
    },
    { context: { timeUntilNext } }
  );
};

export const statsToTopGG = async (guildCount: number) => {
  const res = await fetch(`https://top.gg/api/bots/${config.botId}/stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.topGGToken,
    },
    body: JSON.stringify({
      server_count: guildCount,
    }),
  });

  if (res.status !== 200) {
    throw new Error("Failed to post stats to top.gg");
  }
};

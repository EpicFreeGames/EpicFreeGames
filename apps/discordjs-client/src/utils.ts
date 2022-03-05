import { db, logger } from "shared";
import fetch from "node-fetch";
import { IClient } from "./types";
import { config } from "config";
import moment from "moment";

export const getGuildCount = async (c: IClient) => {
  const res = await c.cluster.broadcastEval((c: any) => {
    return c.guilds.cache.size;
  });

  return res.reduce((a, b) => a + b, 0);
};

export const getTimeToClosestGame = async () => {
  let games = await db.games.get.upcoming();

  if (!games.length) return null;

  games = games.sort((a, b) => a.start.getTime() - b.start.getTime());

  const start = games[0]?.start || new Date();

  const dur = moment.duration(moment(start).diff(moment())).humanize();

  return dur;
};

export const updatePresence = async (c: IClient) => {
  const timeUntilNext = await getTimeToClosestGame();

  logger.console(`Updating presence: ${timeUntilNext}`);

  // prettier-ignore
  c.cluster?.broadcastEval(
    (c: any, { timeUntilNext }) => {
      c.user?.setPresence({
        activities: [{ name: `/help ${timeUntilNext ? `| ${timeUntilNext} until the next free game!`: ""}`, type: "WATCHING" }],
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
      Authorization: config.topGGAuth,
    },
    body: JSON.stringify({
      server_count: guildCount,
    }),
  });

  if (res.status !== 200) {
    throw new Error("Failed to post stats to top.gg");
  }
};

export const getTopTenGuilds = async (client: IClient) => {
  const guilds = await client.cluster.broadcastEval((c: IClient) => {
    return c.guilds.cache.map((guild) => ({
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
    }));
  });

  if (!Array.isArray(guilds) || !guilds.length) return [];

  return guilds
    .flat()
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 10);
};

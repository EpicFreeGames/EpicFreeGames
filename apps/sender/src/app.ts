import express from "express";
import { db } from "shared";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get("/send", async (req, res) => {
    const body = req.body;
    if (!body) return res.status(400).send("No body");

    const gameIds = body.gameIds;
    let sendingId = body.sendingId;

    let createdNewId = false;

    if (!sendingId) {
      sendingId = Math.random().toString().substring(2, 15);
      createdNewId = true;
    }

    const games = db.games.get.byIds(gameIds);
    if (!games) return res.status(400).send("No games found");

    let noHookGuilds = await db.guilds.get.hasOnlySetChannel();
    let hookGuilds = await db.guilds.get.hasWebhook();

    if (!createdNewId) {
      const sent = await db.logs.getSends(sendingId);
      const sentGuilds = sent.map((s) => s.guildId);

      if (sent) {
        // filter out guilds that have already received the message
        noHookGuilds = noHookGuilds.filter((guild: any) => !sentGuilds.includes(guild.guildId));
        hookGuilds = hookGuilds.filter((guild: any) => !sentGuilds.includes(guild.guildId));
      }
    }

    if (!noHookGuilds.length && !hookGuilds.length) {
      return createdNewId
        ? res.status(400).send("No guilds found")
        : res.status(400).send("No guilds found or all got filtered out");
    }

    return;
  });

  return app;
};

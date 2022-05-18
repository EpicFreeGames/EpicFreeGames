import { Request, Response } from "express";
import mongoose from "mongoose";
import { startWatcher } from "./watcher";
import { ChannelSender } from "./senders/channelSender";
import { HookSender } from "./senders/hookSender";
import { db } from "database";
import { IGuild, IGame } from "shared";

const startSenders = (
  noHookGuilds: IGuild[],
  hookGuilds: IGuild[],
  games: IGame[],
  sendingId: string
) => {
  const hookSender = new HookSender(hookGuilds, games, sendingId);
  const channelSender = new ChannelSender(noHookGuilds, games, sendingId);

  hookSender.start();
  channelSender.start();
};

export const send = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body) return res.status(400).send("No body");

  const gameIds = body.gameIds;
  let sendingId = body.sendingId;

  if (!Array.isArray(gameIds)) return res.status(400).send("No gameIds");
  for (const id of gameIds)
    if (!mongoose.isValidObjectId(id)) return res.status(400).send("Invalid gameIds");

  let createdNewId = false;

  if (!sendingId) {
    sendingId = Math.random().toString().substring(2, 15);
    createdNewId = true;
  }

  const games = await db.games.get.byIds(gameIds);
  if (!games.length) return res.status(400).send("No confirmed games found");

  let noHookGuilds = await db.guilds.get.hasOnlySetChannel();
  let hookGuilds = await db.guilds.get.hasWebhook();

  if (!createdNewId) {
    const sent = await db.logs.sends.getSuccesses(sendingId);

    if (sent) {
      // filter out guilds that have already received the message
      const sentGuilds = sent.map((s) => s.guildId);
      noHookGuilds = noHookGuilds.filter((guild: any) => !sentGuilds.includes(guild.guildId));
      hookGuilds = hookGuilds.filter((guild: any) => !sentGuilds.includes(guild.guildId));
    }
  }

  if (!noHookGuilds.length && !hookGuilds.length)
    return createdNewId
      ? res.status(400).send("No guilds found")
      : res.status(400).send("No guilds found or all got filtered out");

  startSenders(noHookGuilds, hookGuilds, games, sendingId);
  startWatcher(
    noHookGuilds.length + hookGuilds.length,
    sendingId,
    games.map((g) => g.name)
  );

  return res.status(200).send({ sendingId });
};

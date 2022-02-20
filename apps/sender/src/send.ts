import { config } from "config";
import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  embeds,
  db,
  IGame,
  IGuild,
  timeString,
  executeWebhook,
  editWebhookMsg,
  deleteWebhookMsg,
  ISendingStats,
  IFinishedSendingStats,
  wait,
} from "shared";
import { ChannelSender } from "./senders/channelSender";
import { HookSender } from "./senders/hookSender";

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

const startWatcher = async (target: number, sendingId: string, names: string[]) => {
  await wait(500); // wait a bit for the senders to start
  let sendCount = await db.logs.sends.getCount(sendingId);
  let speed = 1;
  let msgId: string | undefined = undefined;
  let start = Date.now();

  let latestSentCountCheck = Date.now();

  await executeWebhook(config.senderHookUrl, { embeds: [embeds.sendingStats.started(names)] });

  const watcher = async (): Promise<any> => {
    const newSendCount = await db.logs.sends.getCount(sendingId);
    speed = ((newSendCount - sendCount) / (Date.now() - latestSentCountCheck)) * 1000;
    latestSentCountCheck = Date.now();
    sendCount = newSendCount;

    const stats: ISendingStats = {
      speed: Math.floor(speed),
      sent: newSendCount,
      target,
      elapsedTime: timeString(Date.now() - start),
      eta: timeString(calculateEta(target - newSendCount, speed)),
    };

    if (!msgId) {
      msgId = (
        await executeWebhook(
          config.senderHookUrl,
          { embeds: [embeds.sendingStats.stats(stats)] },
          true
        )
      ).data?.id;
    } else {
      await editWebhookMsg(msgId, config.senderHookUrl, {
        embeds: [embeds.sendingStats.stats(stats)],
      });
    }

    if (speed !== 0) {
      await wait(1500);
      return watcher();
    }

    const latestLog = await db.logs.sends.getLatest(sendingId);
    const finishedAt = latestLog ? latestLog.createdAt : new Date();

    // sending done
    const finishedStats: IFinishedSendingStats = {
      averageSpeed: Math.floor((newSendCount / (finishedAt.getTime() - start)) * 1000),
      elapsedTime: timeString(finishedAt.getTime() - start),
      sentCount: newSendCount,
    };

    if (!msgId) {
      executeWebhook(config.senderHookUrl, {
        embeds: [embeds.sendingStats.finished(finishedStats)],
      });
    } else {
      await deleteWebhookMsg(msgId, config.senderHookUrl);

      executeWebhook(config.senderHookUrl, {
        embeds: [embeds.sendingStats.finished(finishedStats)],
      });
    }
  };

  watcher();
};

const calculateEta = (target: number, msgPerSec: number) => (target / msgPerSec) * 1000;

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
  if (!games) return res.status(400).send("No games found");

  let noHookGuilds = await db.guilds.get.hasOnlySetChannel();
  let hookGuilds = await db.guilds.get.hasWebhook();

  if (!createdNewId) {
    const sent = await db.logs.sends.getManyById(sendingId);

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

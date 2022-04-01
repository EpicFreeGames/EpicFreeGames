import {
  embeds,
  db,
  executeWebhook,
  editWebhookMsg,
  ISendingStats,
  IFinishedSendingStats,
  wait,
} from "shared";
import { config } from "config";

const secondsToFinish = (target: number, msgPerSec: number) => target / msgPerSec;
const millisToSeconds = (millis: number) => Math.ceil(millis / 1000);

export const startWatcher = async (target: number, sendingId: string, names: string[]) => {
  await wait(1000); // wait a bit for the senders to start
  let sendCount = await db.logs.sends.getCount(sendingId);
  let speed = 1;
  let msgId: string | undefined = undefined;
  let start = Date.now();

  let latestSentCountCheck = Date.now();

  const watcher = async (): Promise<any> => {
    const newSendCount = await db.logs.sends.getCount(sendingId);
    speed = ((newSendCount - sendCount) / (Date.now() - latestSentCountCheck)) * 1000;
    latestSentCountCheck = Date.now();
    sendCount = newSendCount;

    const stats: ISendingStats = {
      speed: Math.floor(speed),
      sent: newSendCount,
      target,
      eta: Math.ceil(millisToSeconds(Date.now()) + secondsToFinish(target - newSendCount, speed)),
      startedAt: start,
      gameNames: names,
    };

    if (!msgId) {
      msgId = (
        await executeWebhook({
          webhookUrl: config.senderHookUrl,
          options: { embeds: [embeds.sendingStats.stats(stats)] },
          wait: true,
        })
      ).data?.id;
    } else {
      await editWebhookMsg(msgId, config.senderHookUrl, {
        embeds: [embeds.sendingStats.stats(stats)],
      });
    }

    if (Date.now() - start < 5000 || speed !== 0) {
      await wait(1500);
      return watcher();
    }

    const latestLog = await db.logs.sends.getLatest(sendingId);
    const finishedAt = (latestLog ? latestLog.createdAt : new Date()).getTime();

    // sending done
    const finishedStats: IFinishedSendingStats = {
      averageSpeed: Math.floor((newSendCount / (finishedAt - start)) * 1000),
      sentCount: newSendCount,
      finishedAt: millisToSeconds(finishedAt),
      gameNames: names,
      startedAt: millisToSeconds(start),
    };

    if (!msgId) {
      executeWebhook({
        webhookUrl: config.senderHookUrl,
        options: { embeds: [embeds.sendingStats.finished(finishedStats)] },
      });
    } else {
      await editWebhookMsg(msgId, config.senderHookUrl, {
        embeds: [embeds.sendingStats.finished(finishedStats)],
      });
    }
  };

  watcher();
};

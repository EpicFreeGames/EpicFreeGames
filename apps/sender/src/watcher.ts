import {
  embeds,
  db,
  timeString,
  executeWebhook,
  editWebhookMsg,
  deleteWebhookMsg,
  ISendingStats,
  IFinishedSendingStats,
  wait,
} from "shared";
import { config } from "config";

const calculateEta = (target: number, msgPerSec: number) => (target / msgPerSec) * 1000;

export const startWatcher = async (target: number, sendingId: string, names: string[]) => {
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

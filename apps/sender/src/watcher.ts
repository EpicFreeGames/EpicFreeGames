import {
  embeds,
  db,
  executeWebhook,
  editWebhookMsg,
  deleteWebhookMsg,
  ISendingStats,
  IFinishedSendingStats,
  wait,
} from "shared";
import { config } from "config";
import moment from "moment";

const calculateEta = (target: number, msgPerSec: number) => target / msgPerSec;

export const startWatcher = async (target: number, sendingId: string, names: string[]) => {
  await wait(1000); // wait a bit for the senders to start
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

    const dur = moment.duration(moment().diff(moment(start)));
    // prettier-ignore
    const elapsedTimeString = `${dur.hours() ? `${dur.hours()}h ` : ""}${dur.minutes()}m ${dur.seconds()}s`;

    const stats: ISendingStats = {
      speed: Math.floor(speed),
      sent: newSendCount,
      target,
      elapsedTime: elapsedTimeString,
      // prettier-ignore
      eta: moment
        .duration(moment(moment().add(calculateEta(target - newSendCount, speed), "s")).diff(moment()))
        .humanize(),
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

    const timeTaken = moment.duration(moment(finishedAt).diff(start));
    // prettier-ignore
    const timeTakenString = `${timeTaken.hours() ? `${timeTaken.hours()}h ` : ""}${timeTaken.minutes()}m ${timeTaken.seconds()}s`;

    // sending done
    const finishedStats: IFinishedSendingStats = {
      averageSpeed: Math.floor((newSendCount / (finishedAt.getTime() - start)) * 1000),
      elapsedTime: timeTakenString,
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

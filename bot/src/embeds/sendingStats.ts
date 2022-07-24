import { Embed } from "discordeno";
import { IFinishedSendingStats, ISendingStats } from "../types.ts";
import { colors, utils } from "./embedUtils.ts";

export const stats = (stats: ISendingStats): Embed => ({
  title: "Sending in progress...",
  color: colors.gray,
  description:
    "**__Games:__**" +
    "\n" +
    stats.gameNames.join("\n") +
    "\n\n" +
    `**__Notifications sent:__** ${stats.sent} / ${stats.target}` +
    "\n\n" +
    `**__Speed:__** ${stats.speed} msg/sec` +
    "\n\n" +
    `**__ETA:__** ${
      !Number.isNaN(stats.eta) && stats.eta < Infinity ? utils.relativeTimestamp(stats.eta) : ""
    }` +
    "\n\n" +
    `**__Started at:__** ${utils.longTime(stats.startedAt)}` +
    "\n\n" +
    `**__ID:__** ${stats.id}`,
});

export const finished = (stats: IFinishedSendingStats): Embed => ({
  title: "Sending finished",
  color: colors.gray,
  description:
    "**__Games:__**" +
    "\n" +
    stats.gameNames.join("\n") +
    "\n\n" +
    `**__Notifications sent:__** ${stats.sentCount}` +
    "\n\n" +
    `**__Average speed:__** ${stats.averageSpeed} msg/sec` +
    "\n\n" +
    `**__Started at:__** ${utils.longTime(stats.startedAt)}` +
    "\n\n" +
    `**__Finished at:__** ${utils.longTime(stats.finishedAt)}` +
    "\n\n" +
    `**__ID:__** ${stats.id}`,
});

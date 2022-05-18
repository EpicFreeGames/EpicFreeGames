import { MessageEmbed } from "discord.js";
import { ISendingStats, IFinishedSendingStats } from "types";
import { utils } from "./utils";

export const stats = (stats: ISendingStats) =>
  new MessageEmbed({
    title: "Sending in progress...",
    color: "#2f3136",
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
      `**__Started at:__** ${utils.longTime(stats.startedAt)}`,
  });

export const finished = (stats: IFinishedSendingStats) =>
  new MessageEmbed({
    title: "Sending finished",
    color: "#2f3136",
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
      `**__Finished at:__** ${utils.longTime(stats.finishedAt)}`,
  });

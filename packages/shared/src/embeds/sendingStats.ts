import { MessageEmbed } from "discord.js";
import { IFinishedSendingStats } from "..";
import { ISendingStats } from "./types";

// prettier-ignore
export const started = (names: string[]) =>
  new MessageEmbed({
    title: "Sending started",
    color: "#2f3136",
    description: 
      "**__Games:__**" + 
      "\n" +
      names.join("\n"),
  }).setTimestamp();

export const stats = (stats: ISendingStats) =>
  new MessageEmbed({
    title: "Status",
    color: "#2f3136",
    description:
      `**__Notifications sent:__** ${stats.sent} / ${stats.target}` +
      "\n\n" +
      `**__Speed:__** ${stats.speed} msg/sec` +
      "\n\n" +
      `**__ETA:__** ${stats.eta}` +
      "\n\n" +
      `**__Elapsed time:__** ${stats.elapsedTime}`,
  });

export const finished = (stats: IFinishedSendingStats) =>
  new MessageEmbed({
    title: "Sending finished",
    color: "#2f3136",
    description:
      `**__Notifications sent:__** ${stats.sentCount}` +
      "\n\n" +
      `**__Average speed:__** ${stats.averageSpeed} msg/sec` +
      "\n\n" +
      `**__Elapsed time:__** ${stats.elapsedTime}`,
  }).setTimestamp();

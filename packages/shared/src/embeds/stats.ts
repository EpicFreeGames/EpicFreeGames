import { MessageEmbed } from "discord.js";
import { IStats } from "./types";
import { utils } from "./utils";

// prettier-ignore
export const stats = (stats: IStats) => 
  new MessageEmbed({
    title: "Stats",
    color: "#2f3136",
    description:
      utils.title("Main") +
      "\n" +
      "DB Guilds: " + utils.bold(stats.guildCount) +
      "\n" +
      "Has webhook: " + utils.bold(stats.hasWebhook) +
      "\n" +
      "Has only channel: " + utils.bold(stats.hasOnlyChannel) +
      "\n" +
      "Has set role: " + utils.bold(stats.hasSetRole) +
      "\n" +
      "Has changed language: " + utils.bold(stats.hasChangedLanguage) + 
      "\n\n" +

      utils.title("Commands ran in the...") +
      "\n" +
      "Last hour: " + utils.bold(stats.commandsRanIn.lastHour) +
      "\n" +
      "Last day: " + utils.bold(stats.commandsRanIn.lastDay) +
      "\n" +
      "Last 7 days: " + utils.bold(stats.commandsRanIn.last7days) +
      "\n" +
      "Last 30 days: " + utils.bold(stats.commandsRanIn.last30days) +
      "\n\n" +

      utils.title("Average commands in...") +
      "\n" +
      "An hour: " + utils.bold(stats.avgCommandsIn.anHour) +
      "\n" +
      "A day: " + utils.bold(stats.avgCommandsIn.aDay),
  });

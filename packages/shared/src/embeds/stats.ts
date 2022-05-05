import { MessageEmbed } from "discord.js";
import { IStats, ICommandsRanIn } from "../types/stats";
import { utils } from "./utils";

// prettier-ignore
export const stats = (stats: IStats) => 
  new MessageEmbed({
    title: "Stats",
    color: "#2f3136",
    description:
      utils.title("Database") +
      "\n" +
      "DB Guilds: " + utils.bold(stats.dbGuildCount) +
      "\n" +
      "Has webhook: " + utils.bold(stats.hasWebhook) +
      "\n" +
      "Has only channel: " + utils.bold(stats.hasOnlyChannel) +
      "\n" +
      "Has set role: " + utils.bold(stats.hasSetRole) +
      "\n" +
      "Has changed language: " + utils.bold(stats.hasChangedLanguage) +
      "\n" +
      "Has changed currency: " + utils.bold(stats.hasChangedCurrency) +
      "\n" +
      "Has set a thread: " + utils.bold(stats.hasSetThread),
  });

// prettier-ignore
export const commandsRanIn = (stats: ICommandsRanIn) => new MessageEmbed({
    title: "Command stats",
    color: "#2f3136",
    description:
      utils.title("Commands ran in the...") +
      "\n" +
      "Last hour: " + utils.bold(stats.lastHour) +
      "\n" +
      "Last day: " + utils.bold(stats.lastDay) +
      "\n" +
      "Last 7 days: " + utils.bold(stats.last7days) +
      "\n" +
      "Last 30 days: " + utils.bold(stats.last30days) +
      "\n\n" +

      utils.title("Average commands in...") +
      "\n" +
      "An hour: " + utils.bold(stats.avgCommandsIn.anHour) +
      "\n" +
      "A day: " + utils.bold(stats.avgCommandsIn.aDay),
  });

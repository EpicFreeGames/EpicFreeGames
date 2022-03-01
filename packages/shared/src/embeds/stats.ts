import { MessageEmbed } from "discord.js";
import { LanguagesWithFlags } from "../localisation";
import { IStats, TopTenGuild } from "../types/stats";
import { utils } from "./utils";

// prettier-ignore
export const stats = (stats: IStats) => 
  new MessageEmbed({
    title: "Stats",
    color: "#2f3136",
    description:
      "Guild Count: " + utils.bold(stats.guildCount) +
      
      "\n\n" +

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

// prettier-ignore
export const topTenGuilds = (guilds: TopTenGuild[]) => {
  const embed = new MessageEmbed({
    title: "Top 10 guilds",
    color: "#2f3136",
    description: "",
  });

  for (const [index, guild] of guilds.entries()) {
    embed.description += utils.title(`${index + 1}. ${utils.bold(guild.name)}`) +
    "\n" +
    "Member count: " + utils.bold(guild.memberCount) +
    "\n" +
    "ID: " + utils.bold(guild.id)

    if (guild.dbInfo) {
      embed.description +=
      "\n" +
      `Language: ${LanguagesWithFlags[guild.dbInfo.language]}` +
      "\n" +
      `Role ID: ${guild.dbInfo.roleId ? guild.dbInfo.roleId : "❌"}` +
      "\n" +
      `Channel ID: ${guild.dbInfo.channelId ? guild.dbInfo.channelId : "❌"}` +
      "\n" +
      `Webhook: ${guild.dbInfo.webhook ? "✅" : "❌"}`;
    } else {
      embed.description += "\n" + utils.bold("Not found in database");
    }

    embed.description += "\n\n";
  }

  return embed;
};

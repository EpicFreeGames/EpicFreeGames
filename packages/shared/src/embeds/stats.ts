import { MessageEmbed } from "discord.js";
import { IStats } from "./types";
import { utils } from "./utils";

// prettier-ignore
export const stats = (stats: IStats) => 
  new MessageEmbed({
    title: "Stats",
    color: "#2f3136",
    description:
      utils.bold("DB Guilds:") + ` ${stats.guildCount}` +
      "\n\n" +
      utils.bold("Has webhook:") + ` ${stats.hasWebhook}` +
      "\n\n" +
      utils.bold("Has only channel:") + ` ${stats.hasOnlyChannel}` +
      "\n\n" +
      utils.bold("Has set role:") + ` ${stats.hasSetRole}` +
      "\n\n" +
      utils.bold("Has changed language:") + ` ${stats.hasChangedLanguage}`,
  })

import { MessageEmbed } from "discord.js";
import { IGuild, ICommandLog } from "../data/types";
import { CommandInteraction } from "../interactions";
import { utils } from "./utils";

const addDbInfo = (guild: IGuild, embed: MessageEmbed) => {
  embed.description +=
    utils.title("DB Info") +
    "\n" +
    `Language: ${guild.language}` +
    "\n" +
    `Role ID: ${guild.roleId}` +
    +"\n" +
    `Channel ID: ${guild.channelId}` +
    "\n" +
    `Webhook: ${guild.webhook ? "✅" : "❌"}`;
};

export const command = (guild: IGuild | null, log: ICommandLog, dms: boolean) => {
  const embed = new MessageEmbed({
    title: `${log.command} ${dms ? "in DMs" : ""}`,
    color: "#2f3136",
    description:
      utils.title("Command Info") +
      "\n" +
      `Sender: ${log.sender.tag}` +
      "\n" +
      `Sender ID: ${log.sender.id}` +
      "\n" +
      `Guild ID: ${log.guildId}` +
      "\n" +
      `Responded in: ${log.respondedIn} ms`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

export const channelSet = (guild: IGuild | null, i: CommandInteraction, channelId: string) => {
  const embed = new MessageEmbed({
    title: "Channel set",
    description:
      utils.title("Info") +
      "\n" +
      `User: ${i.user.tag}` +
      "\n" +
      `User ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Set channel ID: ${channelId}`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

export const roleSet = (guild: IGuild | null, i: CommandInteraction, roleId: string) => {
  const embed = new MessageEmbed({
    title: "Role set",
    description:
      utils.title("Info") +
      "\n" +
      `User: ${i.user.tag}` +
      "\n" +
      `User ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Set role ID: ${roleId}`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

export const languageSet = (guild: IGuild | null, i: CommandInteraction, language: string) => {
  const embed = new MessageEmbed({
    title: "Language set",
    description:
      utils.title("Info") +
      "\n" +
      `User: ${i.user.tag}` +
      "\n" +
      `User ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Set language: ${language}`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

import { MessageEmbed } from "discord.js";
import { Languages, LanguageNames, Currencies, CurrencyData } from "../localisation";
import { IGuild, ICommandLog } from "../data/types";
import { CommandInteraction } from "../interactions/types";
import { utils } from "./utils";

const addDbInfo = (guild: IGuild, embed: MessageEmbed) => {
  embed.description +=
    "\n\n" +
    utils.title("DB Info") +
    "\n" +
    `Language: ${LanguageNames[guild.language]}` +
    "\n" +
    `Currency: ${CurrencyData[guild.currency].name}` +
    "\n" +
    `Role ID: ${guild.roleId ? guild.roleId : "❌"}` +
    "\n" +
    `Channel ID: ${guild.channelId ? guild.channelId : "❌"}` +
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
      `Executor: ${i.user.tag}` +
      "\n" +
      `Executor ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Set channel ID: ${channelId}`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

export const threadSet = (
  guild: IGuild | null,
  i: CommandInteraction,
  parentChannelId: string,
  threadId: string
) => {
  const embed = new MessageEmbed({
    title: "Channel set",
    description:
      utils.title("Info") +
      "\n" +
      `Executor: ${i.user.tag}` +
      "\n" +
      `Executor ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Parent channel ID: ${parentChannelId}` +
      "\n" +
      `Thread ID: ${threadId}`,
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
      `Executor: ${i.user.tag}` +
      "\n" +
      `Executor ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Set role ID: ${roleId}`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

export const languageSet = (guild: IGuild | null, i: CommandInteraction, language: Languages) => {
  const embed = new MessageEmbed({
    title: "Language set",
    description:
      utils.title("Info") +
      "\n" +
      `Executor: ${i.user.tag}` +
      "\n" +
      `Executor ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Set language: ${LanguageNames[language]}`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

export const currencySet = (guild: IGuild | null, i: CommandInteraction, currency: Currencies) => {
  const embed = new MessageEmbed({
    title: "Currency set",
    description:
      utils.title("Info") +
      "\n" +
      `Executor: ${i.user.tag}` +
      "\n" +
      `Executor ID: ${i.user.id}` +
      "\n" +
      `Guild ID: ${i.guildId}` +
      "\n" +
      `Set currency: ${CurrencyData[currency].name}`,
  }).setTimestamp();

  if (guild) addDbInfo(guild, embed);

  return embed;
};

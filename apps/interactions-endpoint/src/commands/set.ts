import {
  embeds,
  logger,
  SlashCommand,
  SubCommandHandler,
  executeWebhook,
  getWebhookUrl,
  getMessage,
} from "shared-discord-stuff";
import { CommandTypes, LanguageDocument, getDefaultLanguage } from "shared";
import { db } from "database";
import {
  getParentId,
  userHasVoted,
  getRole,
  makeSenseOfRole,
  checkForErrorsAndCommunicate,
} from "../utils/commandUtils";
import { createWebhook, deleteWebhook, hasWebhook } from "../utils/webhooks";

export const command: SlashCommand = {
  type: CommandTypes.MANAGE_GUILD,
  needsGuild: true,
  execute: async (i, guild, language, currency) => {
    const subCommand = i.getSubCommand(true);

    if (subCommand?.name === "channel") return channelCommand(i, guild, language, currency);
    if (subCommand?.name === "thread") return threadCommand(i, guild, language, currency);
    if (subCommand?.name === "language") return languageCommand(i, guild, language, currency);
    if (subCommand?.name === "role") return roleCommand(i, guild, language, currency);
    if (subCommand?.name === "currency") return currencyCommand(i, guild, language, currency);
  },
};

const channelCommand: SubCommandHandler = async (i, guild, language, currency) => {
  await i.deferReply({ ephemeral: true });
  const channelId = i.options.getChannelId("channel", true);

  let newChannelsHook = await hasWebhook(channelId).catch((err) => err.message);

  if (await checkForErrorsAndCommunicate(newChannelsHook, i, language, channelId)) return;

  if (guild?.webhook && guild?.channelId !== channelId)
    await deleteWebhook(guild.webhook).catch((err) => db.guilds.remove.webhook(i.guildId!));

  newChannelsHook ??= await createWebhook(channelId).catch((err) => err.message);
  if (!newChannelsHook) return i.editReply({ embeds: [embeds.errors.genericError()] });

  if (await checkForErrorsAndCommunicate(newChannelsHook, i, language, channelId)) return;

  const updatedGuild = await db.guilds.set.webhook(i.guildId!, newChannelsHook, channelId, null);

  logger.discord({ embeds: [embeds.logs.channelSet(updatedGuild, i, channelId)] });
  await i.editReply({
    embeds: [
      embeds.success.channelSet(channelId, language),
      embeds.commands.settings(updatedGuild, language),
    ],
  });

  // send current free games to the newly set channel
  const games = await db.games.get.free();
  const gameEmbeds = embeds.games.games(games, language, currency);
  gameEmbeds.length &&
    (await executeWebhook({
      webhookUrl: getWebhookUrl(newChannelsHook.id, newChannelsHook.token),
      options: getMessage(updatedGuild, gameEmbeds),
    }));
};

const threadCommand: SubCommandHandler = async (i, guild, language, currency) => {
  await i.deferReply({ ephemeral: true });
  const threadId = i.options.getChannelId("thread", true);

  const channelId = await getParentId(threadId).catch((err) => err.message);
  if (!channelId) return i.editReply({ embeds: [embeds.errors.genericError()] });

  if (await checkForErrorsAndCommunicate(channelId, i, language, channelId)) return;

  let newChannelsHook = await hasWebhook(channelId).catch((err: any) => err.message);

  if (await checkForErrorsAndCommunicate(channelId, i, language, channelId)) return;

  if (guild?.webhook && guild?.channelId !== channelId)
    await deleteWebhook(guild.webhook).catch((err: any) => db.guilds.remove.webhook(i.guildId!));

  newChannelsHook ??= await createWebhook(channelId).catch((err: any) => err.message);
  if (!newChannelsHook) return i.editReply({ embeds: [embeds.errors.genericError()] });

  if (await checkForErrorsAndCommunicate(channelId, i, language, channelId)) return;

  const updatedGuild = await db.guilds.set.webhook(
    i.guildId!,
    newChannelsHook,
    channelId,
    threadId
  );

  logger.discord({ embeds: [embeds.logs.threadSet(updatedGuild, i, channelId, threadId)] });
  await i.editReply({
    embeds: [
      embeds.success.channelSet(threadId, language),
      embeds.commands.settings(updatedGuild, language),
    ],
  });

  // send current free games to the newly set thread
  const games = await db.games.get.free();
  const gameEmbeds = embeds.games.games(games, language, currency);
  gameEmbeds.length &&
    (await executeWebhook({
      webhookUrl: getWebhookUrl(updatedGuild.webhook!.id, updatedGuild.webhook!.token),
      options: getMessage(updatedGuild, gameEmbeds),
      threadId,
    }));
};

const languageCommand: SubCommandHandler = async (i, guild, language, currency) => {
  const givenLanguage = i.options.getString("language", true);

  const defaultLanguage = getDefaultLanguage();

  const isDefault = givenLanguage === defaultLanguage.code;

  const dbLanguage = isDefault ? null : await db.languages.get.byCode(givenLanguage);
  if (!dbLanguage && !isDefault) return i.reply({ embeds: [embeds.errors.genericError()] });

  const updatedGuild = await db.guilds.set.language(i.guildId!, dbLanguage as LanguageDocument);

  const embedLang = isDefault ? defaultLanguage : dbLanguage!;

  logger.discord({ embeds: [embeds.logs.languageSet(updatedGuild, i)] });
  return i.reply({
    embeds: [
      embeds.success.updatedSettings(embedLang),
      embeds.commands.settings(updatedGuild, embedLang),
    ],
    ephemeral: true,
  });
};

const currencyCommand: SubCommandHandler = async (i, guild, language, currency) => {
  const givenCurrency = i.options.getString("currency", true);

  const dbCurrency = await db.currencies.get.byCode(givenCurrency);
  if (!dbCurrency) return i.reply({ embeds: [embeds.errors.genericError()] });

  const updatedGuild = await db.guilds.set.currency(i.guildId!, dbCurrency);

  logger.discord({ embeds: [embeds.logs.currencySet(updatedGuild, i)] });
  return i.reply({
    embeds: [
      embeds.success.updatedSettings(language),
      embeds.commands.settings(updatedGuild, language),
    ],
    ephemeral: true,
  });
};

const roleCommand: SubCommandHandler = async (i, guild, language, currency) => {
  await i.deferReply({ ephemeral: true });

  if (!guild || !guild?.channelId)
    return i.editReply({ embeds: [embeds.errors.channelNotSet(language)], ephemeral: true });

  if (!(await userHasVoted(i.user.id)))
    return i.editReply({ embeds: [embeds.errors.mustVote(language)], ephemeral: true });

  const roleId = i.options.getRole("role", true);

  const role = await getRole(i.guildId!, roleId);
  const useful = makeSenseOfRole(role);

  const updatedGuild = await db.guilds.set.role(i.guildId!, useful.toDb);

  logger.discord({ embeds: [embeds.logs.roleSet(updatedGuild, i, useful.toDb)] });
  return i.editReply({
    embeds: [
      embeds.success.roleSet(useful.embed, language),
      embeds.commands.settings(updatedGuild, language),
    ],
    ephemeral: true,
  });
};

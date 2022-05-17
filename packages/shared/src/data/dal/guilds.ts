import { Currencies, Languages } from "../../localisation";
import { GuildModel } from "../models";
import { IWebhook } from "../types/Guild";

const selectString = "-_id -__v -createdAt -updatedAt";

export const create = (guildId: string) => new GuildModel({ guildId }).save();

export const get = {
  one: async (guildId: string) => GuildModel.findOne({ guildId }).select(selectString),

  all: async () => GuildModel.find({}).select(selectString),

  hasWebhook: async () => GuildModel.find({ webhook: { $ne: null } }).select(selectString),
  hasSetRole: async () => GuildModel.find({ roleId: { $ne: null } }).select(selectString),
  hasOnlySetChannel: async () =>
    GuildModel.find({ channelId: { $ne: null }, webhook: null }).select(selectString),

  hasNotSetRole: async () => GuildModel.find({ roleId: null }).select(selectString),

  count: async () => GuildModel.countDocuments(),
  counts: {
    hasWebhook: async () => GuildModel.find({ webhook: { $ne: null } }).countDocuments(),
    hasSetRole: async () => GuildModel.find({ roleId: { $ne: null } }).countDocuments(),
    hasOnlySetChannel: async () =>
      GuildModel.find({ channelId: { $ne: null }, webhook: null }).countDocuments(),
    hasChangedLanguage: async () => GuildModel.find({ language: { $ne: "en" } }).countDocuments(),
    hasChangedCurrency: async () => GuildModel.find({ currency: { $ne: "USD" } }).countDocuments(),
    hasSetThread: async () => GuildModel.find({ threadId: { $ne: null } }).countDocuments(),
    hasLanguage: async (code: string) => GuildModel.find({ language: code }).countDocuments(),
  },
};

// prettier-ignore
export const set = {
  webhook: (guildId: string, webhook: IWebhook | null, channelId: string, threadId: string | null) =>
    GuildModel.findOneAndUpdate(
      { guildId },
      { guildId, webhook, channelId, threadId },
      { upsert: true, new: true }
    ).select(selectString),

  role: async (guildId: string, roleId: string) =>
    GuildModel
      .findOneAndUpdate({ guildId }, { guildId, roleId }, { new: true })
      .select(selectString),

  language: async (guildId: string, language: Languages) =>
    GuildModel
      .findOneAndUpdate({ guildId }, { guildId, language }, { upsert: true, new: true })
      .select(selectString),

  currency: async (guildId: string, currency: Currencies) =>
    GuildModel
      .findOneAndUpdate({ guildId }, { guildId, currency }, { upsert: true, new: true })
      .select(selectString),
};

export const remove = {
  webhook: async (guildId: string) =>
    GuildModel.findOneAndUpdate(
      { guildId },
      { $set: { webhook: null, channelId: null, threadId: null } },
      { new: true }
    ).select(selectString),

  role: async (guildId: string) =>
    GuildModel.findOneAndUpdate(
      { guildId },
      { $set: { roleId: null } },
      { upsert: true, new: true }
    ).select(selectString),
};

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

  hasNoWebhook: async () => GuildModel.find({ webhook: null }).select(selectString),
  hasNotSetRole: async () => GuildModel.find({ roleId: null }).select(selectString),

  count: async () => GuildModel.countDocuments(),
  counts: {
    hasWebhook: async () => GuildModel.find({ webhook: { $ne: null } }).countDocuments(),
    hasSetRole: async () => GuildModel.find({ roleId: { $ne: null } }).countDocuments(),
    hasOnlySetChannel: async () =>
      GuildModel.find({ channelId: { $ne: null }, webhook: null }).countDocuments(),
    hasChangedLanguage: async () => GuildModel.find({ language: { $ne: "en" } }).countDocuments(),
    hasChangedCurrency: async () => GuildModel.find({ currency: { $ne: "USD" } }).countDocuments(),

    hasNoWebhook: async () => GuildModel.find({ webhook: null }).countDocuments(),
  },
};

export const set = {
  webhook: (guildId: string, webhook: IWebhook | null, channelId: string) =>
    GuildModel.findOneAndUpdate(
      { guildId },
      { guildId, webhook, channelId },
      { upsert: true, new: true }
    ).select(selectString),

  role: async (guildId: string, roleId: string) =>
    GuildModel.findOneAndUpdate({ guildId }, { guildId, roleId }, { new: true }).select(
      selectString
    ),

  language: async (guildId: string, language: Languages) =>
    GuildModel.updateOne({ guildId }, { guildId, language }, { upsert: true }),

  currency: async (guildId: string, currency: Currencies) =>
    GuildModel.updateOne({ guildId }, { guildId, currency }, { upsert: true }),
};

export const remove = {
  webhook: async (guildId: string) =>
    GuildModel.findOneAndUpdate(
      { guildId },
      { $set: { webhook: null, channelId: null } },
      { new: true }
    ).select(selectString),

  role: async (guildId: string) =>
    GuildModel.findOneAndUpdate(
      { guildId },
      { $set: { roleId: null } },
      { upsert: true, new: true }
    ).select(selectString),
};

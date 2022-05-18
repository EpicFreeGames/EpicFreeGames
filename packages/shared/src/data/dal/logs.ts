import { ICommandLog, ISendingLog } from "types";
import { CommandLogModel, SendingLogModel } from "../models";

export const commands = {
  add: async (log: ICommandLog) => new CommandLogModel(log).save(),
  // prettier-ignore
  get: {
    all: async () => CommandLogModel.find({}).countDocuments(),
    lastHour: async () => CommandLogModel.find({ createdAt: { $gte: new Date(Date.now() - 3600000) }}).countDocuments(),
    lastDay: async () => CommandLogModel.find({ createdAt: { $gte: new Date(Date.now() - 86400000) }}).countDocuments(),
    last7days: async () => CommandLogModel.find({ createdAt: { $gte: new Date(Date.now() - 604800000) }}).countDocuments(),
    last30days: async () => CommandLogModel.find({ createdAt: { $gte: new Date(Date.now() - 2628000000) }}).countDocuments(),
  },
};

export const sends = {
  add: async (log: ISendingLog) => new SendingLogModel(log).save(),
  getSuccesses: async (sendingId: string) => SendingLogModel.find({ sendingId, success: true }),
  getCount: async (sendingId: string) => SendingLogModel.countDocuments({ sendingId }),
  getLatest: async (sendingId: string) =>
    SendingLogModel.findOne({ sendingId }).sort({ createdAt: -1 }),
};

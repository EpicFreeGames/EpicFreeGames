import { CommandLogModel, SendingLogModel } from "../models";
import { ICommandLog } from "../types/CommandLog";
import { ISendingLog } from "../types/SendingLog";

export const commands = {
  add: async (log: ICommandLog) => new CommandLogModel(log).save(),
};

export const sends = {
  add: async (log: ISendingLog) => new SendingLogModel(log).save(),
  getManyById: async (sendingId: string) => SendingLogModel.find({ sendingId }),
  getCount: async (sendingId: string) => SendingLogModel.countDocuments({ sendingId }),
  getLatest: async (sendingId: string) =>
    SendingLogModel.findOne({ sendingId }).sort({ createdAt: -1 }),
};

import { CommandLogModel, SendingLogModel } from "../models";
import { ICommandLog, ISendingLog } from "../types";

export const addCommand = async (log: ICommandLog) => new CommandLogModel(log).save();

export const addSend = async (log: ISendingLog) => new SendingLogModel(log).save();
export const getSends = async (sendingId: string) => SendingLogModel.find({ sendingId });

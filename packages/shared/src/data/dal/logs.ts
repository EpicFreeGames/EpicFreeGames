import { CommandLogModel } from "../models";
import { ICommandLog } from "../types";

export const addCommand = async (log: ICommandLog) => new CommandLogModel(log).save();

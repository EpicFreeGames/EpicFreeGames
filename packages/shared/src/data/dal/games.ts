import { GameModel } from "../models";

const selectString = "-__v -createdAt -updatedAt";

export const get = {
  all: async () => GameModel.find({}).select(selectString),

  free: async (start: number = Date.now()) =>
    GameModel.find({
      confirmed: true,
      start: { $lte: start },
      end: { $gt: start },
    }).select(selectString),

  upcoming: async (start: number = Date.now()) =>
    GameModel.find({ start: { $gt: start } }).select(selectString),

  byIds: async (ids: string[]) => GameModel.find({ _id: { $in: ids } }).select(selectString),
};

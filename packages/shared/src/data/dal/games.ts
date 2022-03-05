import { GameModel } from "../models";
import { IGame } from "../types";

const selectString = "-__v -createdAt -updatedAt";

export const create = (game: IGame) => new GameModel(game).save();

export const confirm = async (ids: string[]) =>
  GameModel.updateMany({ _id: { $in: ids } }, { confirmed: true });

export const get = {
  all: async () => GameModel.find({}).select(selectString),

  free: async (start: number = Date.now()) =>
    GameModel.find({
      confirmed: true,
      start: { $lte: start },
      end: { $gt: start },
    }).select(selectString),

  upcoming: async (start: number = Date.now()) =>
    GameModel.find({ start: { $gt: start }, confirmed: true }).select(selectString),

  byIds: async (ids: string[]) =>
    GameModel.find({ _id: { $in: ids }, confirmed: true }).select(selectString),
};

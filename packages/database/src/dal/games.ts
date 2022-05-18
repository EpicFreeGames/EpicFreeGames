import { GameModel } from "../models";
import { GamePrices, IGame } from "shared";

const selectString = "-__v -createdAt -updatedAt";

export const create = (game: IGame) => new GameModel(game).save();

export const update = {
  prices: async (slug: string, prices: GamePrices) =>
    GameModel.updateOne({ slug }, { $set: { price: prices } }),
  start: async (slug: string, start: Date) => GameModel.updateOne({ slug }, { start }),
  end: async (slug: string, end: Date) => GameModel.updateOne({ slug }, { end }),
};

export const confirm = async (ids: string[]) =>
  GameModel.updateMany({ _id: { $in: ids } }, { confirmed: true });

export const unconfirm = async (ids: string[]) =>
  GameModel.updateMany({ _id: { $in: ids } }, { confirmed: false });

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

  bySlug: async (slug: string) => GameModel.findOne({ slug }).select(selectString),
};

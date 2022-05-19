import { GameModel } from "../models";
import { GamePrices, IGame } from "shared";

const selectString = "-__v -createdAt -updatedAt";

export const create = (game: IGame) => new GameModel(game).save();

export const update = {
  game: async (id: string, game: IGame) => GameModel.updateOne({ _id: id }, game),
  prices: async (slug: string, prices: GamePrices, existingUsd: string) =>
    GameModel.updateOne({ slug }, { $set: { price: { ...prices, USD: existingUsd } } }),
  start: async (slug: string, start: Date) => GameModel.updateOne({ slug }, { start }),
  end: async (slug: string, end: Date) => GameModel.updateOne({ slug }, { end }),
};

export const confirm = async (ids: string[]) =>
  GameModel.updateMany({ _id: { $in: ids } }, { confirmed: true });

export const unconfirm = async (ids: string[]) =>
  GameModel.updateMany({ _id: { $in: ids } }, { confirmed: false });

export const get = {
  all: async () => GameModel.find({}).select(selectString).lean(),

  free: async (start: number = Date.now()) =>
    GameModel.find({
      confirmed: true,
      start: { $lte: start },
      end: { $gt: start },
    })
      .select(selectString)
      .lean(),

  upcoming: async (start: number = Date.now()) =>
    GameModel.find({ start: { $gt: start }, confirmed: true })
      .select(selectString)
      .lean(),

  byIds: async (ids: string[]) =>
    GameModel.find({ _id: { $in: ids }, confirmed: true })
      .select(selectString)
      .lean(),

  byId: async (id: string) => GameModel.findOne({ _id: id }).select(selectString).lean(),

  bySlug: async (slug: string) => GameModel.findOne({ slug }).select(selectString).lean(),

  notConfirmed: async () => GameModel.find({ confirmed: false }).select(selectString).lean(),
};

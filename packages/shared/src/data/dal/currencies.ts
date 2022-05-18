import { CurrencyModel } from "../models";
import { ICurrency } from "types";
import { CurrencyDocument } from "../DocTypes";

const selectString = "-_id -__v -createdAt -updatedAt";

export const get = {
  all: async (): Promise<CurrencyDocument[]> => CurrencyModel.find({}).select(selectString).lean(),
  byCode: async (code: string): Promise<CurrencyDocument> =>
    CurrencyModel.findOne({ code }).select(selectString).lean(),
};

export const create = (currency: ICurrency) => new CurrencyModel(currency).save();

export const update = async (
  code: string,
  currency: ICurrency
): Promise<CurrencyDocument | null> => {
  const currencyToUpdate = await CurrencyModel.findOne({ code }).lean();
  if (!currencyToUpdate) return null;

  return CurrencyModel.findOneAndUpdate({ code }, currency, { new: true }).lean();
};

export const remove = async (code: string): Promise<CurrencyDocument | null> =>
  CurrencyModel.findOneAndDelete({ code }).lean();

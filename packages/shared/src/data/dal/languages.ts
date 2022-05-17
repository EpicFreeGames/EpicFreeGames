import { LanguageModel } from "../models";
import { ILanguage } from "../types/Internationalization";

const selectString = "-_id -__v -createdAt -updatedAt";

export const get = {
  all: async () => LanguageModel.find({}).select(selectString).lean(),
  byCode: async (code: string) => LanguageModel.findOne({ code }).select(selectString).lean(),
};

export const create = (language: ILanguage) => new LanguageModel(language).save();

export const update = async (code: string, language: ILanguage) => {
  const languageToUpdate = await LanguageModel.findOne({ code }).lean();
  if (!languageToUpdate) return null;

  return LanguageModel.findOneAndUpdate({ code }, language, { new: true }).lean();
};

export const remove = async (code: string) => LanguageModel.findOneAndDelete({ code }).lean();

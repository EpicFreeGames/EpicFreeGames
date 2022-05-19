import { ILanguage, LanguageDocument } from "shared";
import { LanguageModel } from "../models";

const selectString = "-__v";

export const get = {
  all: async (): Promise<LanguageDocument[]> => LanguageModel.find({}).select(selectString).lean(),
  byCode: async (code: string): Promise<LanguageDocument> =>
    LanguageModel.findOne({ code }).select(selectString).lean(),
};

export const create = (language: ILanguage) => new LanguageModel(language).save();

export const update = async (
  code: string,
  language: ILanguage
): Promise<LanguageDocument | null> => {
  const languageToUpdate = await LanguageModel.findOne({ code }).lean();
  if (!languageToUpdate) return null;

  return LanguageModel.findOneAndUpdate({ code }, language, { new: true }).lean();
};

export const remove = async (code: string): Promise<LanguageDocument | null> =>
  LanguageModel.findOneAndDelete({ code }).lean();

import { ILanguageWithGuildCount } from "shared";
import { request } from ".";
import { IAddLanguageValues, IUpdateLanguageValues } from "../validation/Languages";
import toast from "react-hot-toast";

export const addLanguage = async (
  values: IAddLanguageValues,
  onSuccess: () => void,
  currentLanguages?: ILanguageWithGuildCount[]
): Promise<ILanguageWithGuildCount[]> =>
  toast.promise(
    (async () => {
      const addedLang = await request<ILanguageWithGuildCount>({
        path: "/languages",
        method: "POST",
        body: values,
      });

      onSuccess();

      const filtered = currentLanguages?.filter((l) => l.code !== values.code) || [];
      return [...filtered, addedLang];
    })(),
    {
      loading: "Adding language",
      success: "Language added",
      error: "Failed to add language",
    }
  );

export const updateLanguage = async (
  code: string,
  values: IUpdateLanguageValues,
  onSuccess: () => void,
  currentLanguages?: ILanguageWithGuildCount[]
): Promise<ILanguageWithGuildCount[]> =>
  toast.promise(
    (async () => {
      const updatedLang = await request<ILanguageWithGuildCount>({
        path: `/languages/${code}`,
        method: "PATCH",
        body: values,
      });

      onSuccess();

      const filtered = currentLanguages?.filter((l) => l.code !== code) || [];
      return [...filtered, updatedLang];
    })(),
    {
      loading: "Updating language",
      success: "Language updated",
      error: "Failed to update language",
    }
  );

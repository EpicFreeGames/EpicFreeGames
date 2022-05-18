import { showNotification, updateNotification } from "@mantine/notifications";
import { ILanguageWithGuildCount } from "shared";
import { CircleCheck, CircleX } from "tabler-icons-react";
import { request } from ".";
import { IAddLanguageValues, IUpdateLanguageValues } from "../validation/Languages";

export const addLanguage = async (
  values: IAddLanguageValues,
  onSuccess: () => void,
  currentLanguages?: ILanguageWithGuildCount[]
): Promise<ILanguageWithGuildCount[]> => {
  try {
    showNotification({
      id: "add-language",
      loading: true,
      message: "Adding language",
    });

    const addedLang = await request<ILanguageWithGuildCount>({
      path: "/languages",
      method: "POST",
      body: values,
    });

    onSuccess();

    updateNotification({
      id: "add-language",
      message: "Language added",
      icon: <CircleCheck />,
      color: "green",
    });

    const filtered = currentLanguages?.filter((l) => l.code !== values.code) || [];
    return [...filtered, addedLang];
  } catch (err) {
    updateNotification({
      id: "add-language",
      message: "Failed to add language",
      icon: <CircleX />,
      color: "red",
    });

    throw err;
  }
};

export const updateLanguage = async (
  code: string,
  values: IUpdateLanguageValues,
  onSuccess: () => void,
  currentLanguages?: ILanguageWithGuildCount[]
) => {
  try {
    showNotification({
      id: "update-language",
      loading: true,
      message: "Updating language",
    });

    const updatedLang = await request<ILanguageWithGuildCount>({
      path: `/languages/${code}`,
      method: "PATCH",
      body: values,
    });

    onSuccess();

    updateNotification({
      id: "update-language",
      message: "Language updated",
      icon: <CircleCheck />,
      color: "green",
    });

    const filtered = currentLanguages?.filter((l) => l.code !== code) || [];
    return [...filtered, updatedLang];
  } catch (err) {
    updateNotification({
      id: "update-language",
      message: "Failed to update language",
      icon: <CircleX />,
      color: "red",
    });

    throw err;
  }
};

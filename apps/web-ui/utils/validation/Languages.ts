import * as Yup from "yup";

export const languageSchema = Yup.object()
  .shape({
    englishName: Yup.string().required("Required"),
    localizedName: Yup.string().required("Required"),
    code: Yup.string().required("Required"),
  })
  .required();

export type IAddLanguageValues = Yup.InferType<typeof languageSchema>;
export type IUpdateLanguageValues = Yup.InferType<typeof languageSchema>;

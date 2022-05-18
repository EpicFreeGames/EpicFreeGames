import * as Yup from "yup";

export const currencySchema = Yup.object()
  .shape({
    code: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    apiValue: Yup.string().required("Required"),
    inFrontOfPrice: Yup.string().optional(),
    afterPrice: Yup.string().optional(),
  })
  .required();

export type IAddCurrencyValues = Yup.InferType<typeof currencySchema>;
export type IUpdateCurrencyValues = Yup.InferType<typeof currencySchema>;

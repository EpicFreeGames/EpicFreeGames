import { GamePrices } from "shared";
import * as Yup from "yup";

export const gameValidationSchema = Yup.object()
  .shape({
    name: Yup.string().required("Required"),
    imageUrl: Yup.string().required("Required"),
    start: Yup.date().required("Required"),
    end: Yup.date().required("Required"),
  })
  .required();

export type IAddGameValues = Yup.InferType<typeof gameValidationSchema> & GamePrices;
export type IUpdateGameValues = Yup.InferType<typeof gameValidationSchema> & GamePrices;

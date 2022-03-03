import { Currencies } from "../..";

export interface IGame {
  _id?: string;
  name: string;
  imageUrl: string;
  slug: string;
  start: Date;
  end: Date;
  price: {
    [key in Currencies]: string;
  };
}

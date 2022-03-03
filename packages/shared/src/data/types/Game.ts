import { Currencies } from "../..";

export interface IGame {
  _id: string;
  name: string;
  imageUrl: string;
  start: number;
  end: number;
  price: {
    [key in Currencies]: string;
  };
  store: {
    name: string;
    url: string;
  };
  slug: string;
}

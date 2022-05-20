export interface IGame {
  _id?: string;
  name: string;
  imageUrl: string;
  slug: string;
  start: Date;
  end: Date;
  confirmed: boolean;
  revalidate: boolean;
  price: GamePrices;
}

export type GamePrices = {
  [key: string]: string;
};

export interface IGame {
  _id?: string;
  name: string;
  imageUrl: string;
  start: Date;
  end: Date;
  confirmed: boolean;
  revalidate: boolean;
  price: GamePrices;
  link: string;
}

export type GamePrices = {
  [key: string]: string;
};

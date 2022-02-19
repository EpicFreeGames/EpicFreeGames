export interface IGame {
  _id: string;
  name: string;
  imgUrl: string;
  start: number;
  end: number;
  sent: boolean;
  confirmed: boolean;
  price: string;
  store: {
    name: string;
    url: string;
  };
  slug: string;
}

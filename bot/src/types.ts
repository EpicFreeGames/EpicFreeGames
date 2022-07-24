export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RestMethod = Exclude<Method, "HEAD">;

export type Game = {
  name: string;
  displayName: string;
  imageUrl: string;
  /**
   * Date as an ISO string
   */
  start: string;
  /**
   * Date as an ISO string
   */
  end: string;
  path: string;
  confirmed: boolean;
  prices: [
    {
      value: number;
      formattedValue: string;
      currencyCode: string;
    }
  ];
};

export type Language = {
  code: string;
  englishName: string;
  nativeName: string;
};

export type Currency = {
  code: string;
  name: string;
  apiValue: string;
  inFrontOfPrice: string;
  afterPrice: string;
};

export type Server = {
  id: string;
  roleId: string | null;
  channelId: string | null;
  threadId: string | null;
  languageCode: Language["code"];
  currency: Currency;
  currencyCode: Currency["code"];
  createdAt: number;
};

export interface ISendingStats {
  id: string;
  speed: number;
  sent: number;
  target: number;
  eta: number;
  startedAt: number;
  gameNames: string[];
}

export interface IFinishedSendingStats {
  id: string;
  averageSpeed: number;
  sentCount: number;
  startedAt: number;
  finishedAt: number;
  gameNames: string[];
}

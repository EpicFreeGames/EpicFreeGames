import { Languages } from "../localisation/languages";

export interface IGame {
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

export interface ICommandLog {
  command: string;
  sender: {
    id: string;
    tag: string;
  };
  guildId: string | null;
  respondedIn: number;
}

export interface IWebhook {
  id: string;
  token: string;
}

export interface IGuild {
  guildId: string;
  roleId: string | null;
  channelId: string | null;
  language: Languages;
  webhook: IWebhook | null;
}

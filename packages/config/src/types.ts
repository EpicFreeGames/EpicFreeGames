export interface IConfig {
  [key: string]: any;

  interactionsPort: number;
  senderPort: number;

  loggingHookUrl: string;

  statsUrl: string;

  botId: string;
  botToken: string;
  botPublicKey: string;

  mongoUrl: string;

  topGGAuth: string;

  adminIds: string[];
  guildId: string;

  prod: boolean;
}

export interface IConstants {
  [key: string]: any;

  gifs: {
    [key: string]: any;

    vote: string;
    invite: string;
  };

  links: {
    [key: string]: any;

    botInvite: string;
    serverInvite: string;
    vote: string;
    website: string;
    commands: string;
    browserRedirect: string;
    launcherRedirect: string;
  };

  webhookName: string;

  userIds: {
    [key: string]: any;

    prod: string;
    dev: string;
  };

  photos: {
    [key: string]: any;

    thumbnail: string;
    base64Thumb: string;
  };
}

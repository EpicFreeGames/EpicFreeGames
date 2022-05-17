export interface IConfig {
  [key: string]: any;

  crowdinDistHash: string;

  interactionsPort: number;
  senderPort: number;
  clientPort: number;

  infoHookUrl: string;
  loggingHookUrl: string;
  senderHookUrl: string;

  senderUrl: string;

  botId: string;
  botToken: string;
  botPublicKey: string;

  mongoUrl: string;

  topGGAuth: string;

  adminIds: string[];
  guildId: string;

  prod: boolean;

  webUi: {
    discordClientId: string;
    discordClientSecret: string;
    nextAuthSecret: string;
  };
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

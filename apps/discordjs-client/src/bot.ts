import { config } from "config";
import Cluster from "discord-hybrid-sharding";
import { Client, ClientOptions, Options } from "discord.js";
import { logger } from "shared";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { EventFile } from "./types";

class IClient extends Client {
  cluster: Cluster.Client = new Cluster.Client(this);

  constructor(options: ClientOptions) {
    super(options);
  }
}

const client = new IClient({
  intents: ["GUILDS"],

  allowedMentions: {},
  partials: [],

  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,

  makeCache: Options.cacheWithLimits({
    ...Options.defaultMakeCacheSettings,
    ApplicationCommandManager: 0,
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildScheduledEventManager: 0,
    GuildEmojiManager: 0,
    GuildInviteManager: 0,
    GuildMemberManager: 0,
    GuildStickerManager: 0,
    MessageManager: 0,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    UserManager: 0,
    VoiceStateManager: 0,
  }),

  restGlobalRateLimit: 48,
  restRequestTimeout: 8000,
});

fs.readdir(
  path.resolve(process.cwd(), dirname(fileURLToPath(import.meta.url)), "./events"),
  async (err, files) => {
    if (err) return console.log(err);

    for (const file of files) {
      if (file.split(".")[1] !== "js") continue;
      const eventName = file.split(".")[0];
      const eventFile: EventFile = await import(`./events/${eventName}`);

      console.log(`Loaded event ${eventName}`);

      const event = eventFile.event;

      event.once && client.once(eventName, event.execute.bind(null, client));

      !event.once && client.on(eventName, event.execute.bind(null, client));
    }
  }
);

client.on("shardReady", (id) => {
  logger.console(`Shard ${id} ready`);
  logger.info(`Shard ${id} ready`);
});

client.login(config.botToken);

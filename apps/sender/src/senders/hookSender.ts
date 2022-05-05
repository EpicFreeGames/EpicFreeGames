import axios, { AxiosInstance } from "axios";
import {
  db,
  discordApiBaseUrl,
  embeds,
  getGuildLang,
  IGame,
  IGuild,
  ISendingLog,
  wait,
  getGuildCurrency,
  getWebhookUrl,
  executeWebhook,
  getMessage,
} from "shared";

export class HookSender {
  guilds: IGuild[];
  games: IGame[];

  sendingId: string;

  axios: AxiosInstance;

  constructor(guilds: IGuild[], games: IGame[], sendingId: string) {
    this.guilds = guilds;
    this.games = games;
    this.sendingId = sendingId;

    this.axios = axios.create({
      baseURL: `${discordApiBaseUrl}/webhooks`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async start() {
    for (const guild of this.guilds) {
      const gameEmbeds = embeds.games.games(
        this.games,
        getGuildLang(guild),
        getGuildCurrency(guild)
      );
      const data = getMessage(guild, gameEmbeds);

      await wait(4);

      if (!guild.webhook) {
        console.log("no webhook", guild);
        continue;
      }

      executeWebhook({
        webhookUrl: getWebhookUrl(guild.webhook.id, guild.webhook.token),
        options: data,
        threadId: guild.threadId,
      })
        .then((res) => {
          const log: ISendingLog = {
            guildId: guild.guildId,
            sendingId: this.sendingId,
            type: "webhook",
            result: {
              success: true,
              reason: res?.status?.toString(),
            },
          };

          console.log(`sent to ${guild.guildId} (webhook)`);

          db.logs.sends.add(log).catch((err) => console.log("log (webhook1):", err.message));
        })
        .catch((err: any) => {
          const log: ISendingLog = {
            guildId: guild.guildId,
            sendingId: this.sendingId,
            type: "webhook",
            result: {
              success: false,
              reason: null,
            },
          };

          if (!err?.response) {
            log.result.reason = "no response";
            console.log("(HOOK) NOT SENT", log.result.reason, guild.guildId);
            db.logs.sends.add(log).catch((err) => console.log("log (webhook2):", err.message));

            return;
          }

          if (err?.response?.data?.code) {
            log.result.reason = err?.response?.data?.code;
            console.log("(HOOK) NOT SENT", log.result.reason, guild.guildId);
            db.guilds.remove.webhook(guild.guildId).catch(() => null);
            db.logs.sends.add(log).catch((err) => console.log("log (webhook2):", err.message));

            return;
          }

          if (err?.response?.status) {
            log.result.reason = err?.response?.status;
            console.log("(HOOK) NOT SENT", log.result.reason, guild.guildId);
            if (err.response.status === 429) return console.log("RATELIMIT");

            db.logs.sends.add(log).catch((err) => console.log("log (webhook3):", err.message));

            return;
          }

          log.result.reason = "hmm";
          console.log("(HOOK) NOT SENT", log.result.reason, guild.guildId);
          db.logs.sends.add(log).catch((err) => console.log("log (webhook4):", err.message));
        });
    }
  }
}

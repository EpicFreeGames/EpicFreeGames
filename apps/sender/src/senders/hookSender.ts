import {
  db,
  discordApiBaseUrl,
  embeds,
  getGuildLang,
  IGame,
  IGuild,
  ISendingLog,
  wait,
} from "shared";
import fetch from "node-fetch";
import { getDataToSend } from "../utils";

export class HookSender {
  guilds: IGuild[];
  games: IGame[];

  sendingId: string;

  constructor(guilds: IGuild[], games: IGame[], sendingId: string) {
    this.guilds = guilds;
    this.games = games;
    this.sendingId = sendingId;
  }

  async start() {
    for (const guild of this.guilds) {
      const gameEmbeds = embeds.games.games(this.games, getGuildLang(guild));
      const data = getDataToSend(guild, gameEmbeds);

      await wait(5);

      if (!guild.webhook) {
        console.log("no webhook", guild);
        continue;
      }

      fetch(`${discordApiBaseUrl}/webhooks/${guild.webhook.id}/${guild.webhook.token}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then(async (err: any) => {
          const log: ISendingLog = {
            guildId: guild.guildId,
            sendingId: this.sendingId,
            result: {
              success: true,
              reason: err.status.toString(),
            },
          };

          if (!err.ok) {
            console.log("HOOK NOT SENT", err.status, guild.guildId);
            try {
              const res = await err.json();
              if (res?.code) {
                log.result.reason = res.code;
                db.guilds.remove.webhook(guild.guildId).catch(() => null);
              }
            } catch (err: any) {
              console.log("convert to json failed: ", err?.message);
            }
          }

          db.logs.sends.add(log).catch((err) => console.log("log (hook1):", err.message));

          console.log(`sent to: ${guild.guildId} (webhook)`);
        })
        .catch((err: any) => {
          const log: ISendingLog = {
            guildId: guild.guildId,
            sendingId: this.sendingId,
            result: {
              success: false,
              reason: err?.message,
            },
          };

          console.log("hook weird err", err?.message);

          db.logs.sends.add(log).catch((err) => console.log("log (hook2):", err.message));
        });
    }
  }
}

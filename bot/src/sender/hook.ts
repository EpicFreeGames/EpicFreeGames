import { embeds } from "../embeds/mod.ts";
import { languages } from "../i18n/languages.ts";
import { Game } from "../types.ts";
import { executeWebhook } from "../utils/webhook.ts";
import { sender } from "./mod.ts";
import { HookServer } from "./send.ts";
import { logLog, wait } from "./utils.ts";

export const hookSender = async (games: Game[], servers: HookServer[], sendingId: string) => {
  for (const server of servers) {
    await wait(4);

    const { webhookId, webhookToken, threadId, languageCode } = server;

    const language = languages.get(languageCode) || languages.get("en")!;
    const gameEmbeds = games.map((game) => embeds.games.gameEmbed(game, language, server.currency));

    executeWebhook(sender, {
      id: webhookId,
      token: webhookToken,
      threadId,
      options: {
        embeds: gameEmbeds,
      },
    })
      .then(async (res) => {
        if (res?.ok)
          return logLog({
            serverId: server.id,
            sendingId,
            type: "hook",
            result: "ok",
            success: true,
          });

        const json = await res.json().catch((_err) => null);

        if (json)
          return logLog({
            serverId: server.id,
            sendingId,
            type: "hook",
            result: JSON.stringify(json),
            success: false,
          });

        const status = res?.status;

        if (status)
          return logLog({
            serverId: server.id,
            sendingId,
            type: "hook",
            result: status + "",
            success: false,
          });

        return logLog({
          serverId: server.id,
          sendingId,
          type: "hook",
          result: "unknown",
          success: false,
        });
      })
      .catch((err) =>
        logLog({
          serverId: server.id,
          sendingId,
          type: "hook",
          success: false,
          result: err?.message,
        })
      );
  }
};

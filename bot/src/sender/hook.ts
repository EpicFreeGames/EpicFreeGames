import { embeds } from "~shared/embeds/mod.ts";
import { languages } from "~shared/i18n/languages.ts";
import { Game } from "~shared/types.ts";
import { displayRole } from "~shared/utils/displayRole.ts";
import { executeWebhook } from "~shared/utils/webhook.ts";
import { logger } from "../_shared/utils/logger.ts";
import { sender } from "./mod.ts";
import { HookServer, logLog, wait } from "./utils.ts";

export const hookSender = async (games: Game[], servers: HookServer[], sendingId: string) => {
  for (const server of servers) {
    await wait(4);

    const { webhookId, webhookToken, threadId, languageCode, roleId } = server;

    const language = languages.get(languageCode) || languages.get("en")!;
    const gameEmbeds = games.map((game) => embeds.games.gameEmbed(game, language, server.currency));

    const role = displayRole(roleId);

    executeWebhook(sender, {
      id: webhookId,
      token: webhookToken,
      threadId,
      options: {
        ...(role ? { content: role } : {}),
        embeds: gameEmbeds,
      },
    })
      .then(async (res) => {
        if (res?.ok) {
          logger.info(`(hook) ${sendingId} sent ${games.length} games to ${server.id}`);

          return logLog({
            serverId: server.id,
            sendingId,
            type: "WEBHOOK",
            result: "ok",
            success: true,
          });
        }

        const json = await res.json().catch((_err) => null);

        if (json)
          return logLog({
            serverId: server.id,
            sendingId,
            type: "WEBHOOK",
            result: JSON.stringify(json),
            success: false,
          });

        const status = res?.status;

        if (status)
          return logLog({
            serverId: server.id,
            sendingId,
            type: "WEBHOOK",
            result: status + "",
            success: false,
          });

        return logLog({
          serverId: server.id,
          sendingId,
          type: "WEBHOOK",
          result: "unknown",
          success: false,
        });
      })
      .catch((err) =>
        logLog({
          serverId: server.id,
          sendingId,
          type: "WEBHOOK",
          success: false,
          result: err?.message,
        })
      );
  }
};

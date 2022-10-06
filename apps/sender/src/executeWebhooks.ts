import { embeds } from "@efg/embeds";
import { logger } from "@efg/logger";
import { displayRole, executeDiscordWebhook, objToStr, wait } from "@efg/shared-utils";
import { IGameWithStuff } from "@efg/types";

import { HookServer, logLog } from "./utils";

export const executeHooks = async (
  games: IGameWithStuff[],
  servers: HookServer[],
  sendingId: string
) => {
  for (const server of servers) {
    await wait(10);

    const gameEmbeds = games.map((game) =>
      embeds.games.game(game, server.language, server.currency)
    );

    executeDiscordWebhook({
      webhookId: server.webhookId,
      webhookToken: server.webhookToken,
      threadId: server.threadId,
      body: {
        ...(server.roleId ? { content: displayRole(server.roleId) } : {}),
        embeds: gameEmbeds,
      },
    })
      .then(({ error }) => {
        if (!error) {
          logger.success(
            "\n" +
              [`[${sendingId}] [WEBHOOK]`, `Sent games to ${server.id}/${server.channelId}`].join(
                "\n"
              )
          );

          logLog({
            serverId: server.id,
            sendingId,
            type: "WEBHOOK",
            result: "ok",
            success: true,
          });
        } else {
          logger.error(
            "\n" +
              [
                `[${sendingId}] [WEBHOOK]`,
                `Failed to send games to ${server.id}/${server.channelId}`,
                `Cause: ${objToStr(error)}`,
              ].join("\n")
          );

          logLog({
            serverId: server.id,
            sendingId,
            type: "WEBHOOK",
            result: JSON.stringify(error),
            success: false,
          });
        }
      })
      .catch((error) => {
        logger.error(
          "\n" +
            [
              `[${sendingId}] [WEBHOOK]`,
              `Failed to send games to ${server.id}/${server.channelId}`,
              `Cause: Network error - ${objToStr(error)}`,
            ].join("\n")
        );

        logLog({
          serverId: server.id,
          sendingId,
          type: "WEBHOOK",
          result: JSON.stringify(error),
          success: false,
        });
      });
  }
};

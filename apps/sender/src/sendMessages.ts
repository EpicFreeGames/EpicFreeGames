import {
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
} from "discord-api-types/v10";

import { embeds } from "@efg/embeds";
import { logger } from "@efg/logger";
import { displayRole, wait, objToStr } from "@efg/shared-utils";
import { IGame } from "@efg/types";

import { discordApi } from "./discordApi";
import { MessageServer, logLog } from "./utils";

export const sendMessages = async (games: IGame[], servers: MessageServer[], sendingId: string) => {
  for (const server of servers) {
    await wait(30);

    const gameEmbeds = games.map((game) =>
      embeds.games.game(game, server.language, server.currency)
    );

    const role = server.roleId ? displayRole(server.roleId) : undefined;

    discordApi<RESTPostAPIChannelMessageResult>({
      method: "POST",
      path: `/channels/${server.channelId}/messages`,
      body: {
        ...(role ? { content: role } : {}),
        embeds: gameEmbeds,
      } as RESTPostAPIChannelMessageJSONBody,
    })
      .then(({ error }) => {
        if (!error) {
          logger.success(
            "\n" +
              [`[${sendingId}] [MESSAGE]`, `Sent games to ${server.id}/${server.channelId}`].join(
                "\n"
              )
          );

          logLog({
            serverId: server.id,
            sendingId,
            type: "MESSAGE",
            result: "ok",
            success: true,
          });
        } else {
          logger.error(
            "\n" +
              [
                `[${sendingId}] [MESSAGE]`,
                `Failed to send games to ${server.id}/${server.channelId}`,
                `Cause: ${objToStr(error)}`,
              ].join("\n")
          );

          logLog({
            serverId: server.id,
            sendingId,
            type: "MESSAGE",
            result: JSON.stringify(error),
            success: false,
          });
        }
      })
      .catch((error) => {
        logger.error(
          "\n" +
            [
              `[${sendingId}] [MESSAGE]`,
              `Failed to send games to ${server.id}/${server.channelId}`,
              `Cause: Network error - ${objToStr(error)}`,
            ].join("\n")
        );

        logLog({
          serverId: server.id,
          sendingId,
          type: "MESSAGE",
          result: JSON.stringify(error),
          success: false,
        });
      });
  }
};

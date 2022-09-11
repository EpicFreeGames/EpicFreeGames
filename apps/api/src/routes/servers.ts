import { Router } from "express";
import { z } from "zod";

import { currencies } from "@efg/i18n";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import prisma from "../data/prisma";
import { prismaUpdateCatcher } from "../data/prismaUpdateCatcher";
import { addLocaleInfoToServer } from "../utils/addLocaleInfoToServers";
import { bigintSchema } from "../utils/jsonfix";
import { withValidation } from "../utils/withValidation";
import { WsMsgType } from "../websocket/types";
import { broadcastWss } from "../websocket/utils";

const router = Router();

router.get(
  "/:serverId",
  endpointAuth(Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;

      const server = await prisma.server.findUnique({
        where: { id: serverId },
      });

      if (!server)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "Server not found",
        });

      res.json(addLocaleInfoToServer(server));
    }
  )
);

router.put(
  "/:serverId/channel",
  endpointAuth(Flags.EditServers, Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
      body: z
        .object({
          channelId: z.string(),
          webhookId: z.string(),
          webhookToken: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { channelId, webhookId, webhookToken } = req.body;

      const updatedServer = await prisma.server.upsert({
        where: { id: serverId },
        update: {
          channelId,
          webhookId,
          webhookToken,
          threadId: null,
        },
        create: {
          id: serverId,
          channelId,
          webhookId,
          webhookToken,
        },
      });

      broadcastWss(req.wss, WsMsgType.ChannelModify);

      res.json(addLocaleInfoToServer(updatedServer));
    }
  )
);

router.delete(
  "/:serverId/channel",
  endpointAuth(Flags.EditServers, Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;

      const updatedServer = await prisma.server
        .update({
          where: { id: serverId },
          data: {
            channelId: null,
            threadId: null,
            webhookId: null,
            webhookToken: null,
          },
        })
        .catch(prismaUpdateCatcher);

      if (!updatedServer)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "Server not found",
        });

      broadcastWss(req.wss, WsMsgType.ChannelDelete);

      res.json(addLocaleInfoToServer(updatedServer));
    }
  )
);

router.put(
  "/:serverId/role",
  endpointAuth(Flags.EditServers, Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
      body: z
        .object({
          roleId: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { roleId } = req.body;

      const updatedServer = await prisma.server.upsert({
        where: { id: serverId },
        update: {
          roleId,
        },
        create: {
          id: serverId,
          roleId,
        },
      });

      broadcastWss(req.wss, WsMsgType.RoleModify);

      res.json(addLocaleInfoToServer(updatedServer));
    }
  )
);

router.delete(
  "/:serverId/role",
  endpointAuth(Flags.EditServers, Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;

      const updatedServer = await prisma.server
        .update({
          where: { id: serverId },
          data: {
            roleId: null,
          },
        })
        .catch(prismaUpdateCatcher);

      if (!updatedServer)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "Server not found",
        });

      broadcastWss(req.wss, WsMsgType.RoleDelete);

      res.json(addLocaleInfoToServer(updatedServer));
    }
  )
);

router.put(
  "/:serverId/thread",
  endpointAuth(Flags.EditServers, Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
      body: z
        .object({
          threadId: z.string(),
          channelId: z.string(),
          webhookId: z.string(),
          webhookToken: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;

      const { threadId, channelId, webhookId, webhookToken } = req.body;

      const updatedServer = await prisma.server.upsert({
        where: { id: serverId },
        update: {
          threadId,
          channelId,
          webhookId,
          webhookToken,
        },
        create: {
          id: serverId,
          threadId,
          channelId,
          webhookId,
          webhookToken,
        },
      });

      broadcastWss(req.wss, WsMsgType.ThreadModify);

      res.json(addLocaleInfoToServer(updatedServer));
    }
  )
);

router.put(
  "/:serverId/language",
  endpointAuth(Flags.EditServers, Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
      body: z
        .object({
          languageCode: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { languageCode } = req.body;

      const updatedServer = await prisma.server.upsert({
        where: { id: serverId },
        create: {
          id: serverId,
          languageCode,
        },
        update: {
          languageCode,
        },
      });

      broadcastWss(req.wss, WsMsgType.LanguageModify);

      res.json(addLocaleInfoToServer(updatedServer));
    }
  )
);

router.put(
  "/:serverId/currency",
  endpointAuth(Flags.EditServers, Flags.GetServers),
  withValidation(
    {
      params: z
        .object({
          serverId: bigintSchema,
        })
        .strict(),
      body: z
        .object({
          currencyCode: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { currencyCode } = req.body;

      const currency = currencies.get(currencyCode);

      if (!currency)
        return res.status(400).json({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid currency code",
        });

      const updatedServer = await prisma.server.upsert({
        where: { id: serverId },
        create: {
          id: serverId,
          languageCode: "en",
          currencyCode,
        },
        update: { currencyCode },
      });

      broadcastWss(req.wss, WsMsgType.CurrencyModify);

      res.json(addLocaleInfoToServer(updatedServer));
    }
  )
);

export const serverRouter = router;

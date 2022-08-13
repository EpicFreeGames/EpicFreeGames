import prisma from "../prisma";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { bigintSchema } from "../utils/jsonfix";
import { withValidation } from "../utils/withValidation";
import { WsMsgType } from "../websocket/types";
import { broadcastWss } from "../websocket/utils";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.get(
  "/:serverId",
  auth(Flags.EditServers),
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

      res.json(server);
    }
  )
);

router.put(
  "/:serverId/channel",
  auth(Flags.EditServers),
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
        },
        create: {
          id: serverId,
          channelId,
          webhookId,
          webhookToken,
          languageCode: "en",
          currency: {
            connectOrCreate: {
              create: {
                code: "USD",
                apiValue: "US",
                name: "$ Dollar (USD)",
                inFrontOfPrice: "$",
              },
              where: { code: "USD" },
            },
          },
        },
      });

      broadcastWss(req.wss, WsMsgType.ChannelModify);

      res.json(updatedServer);
    }
  )
);

router.delete(
  "/:serverId/channel",
  auth(Flags.EditServers),
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

      const updatedServer = await prisma.server.update({
        where: { id: serverId },
        data: {
          channelId: null,
          webhookId: null,
          webhookToken: null,
        },
      });

      if (!updatedServer)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "Server not found",
        });

      broadcastWss(req.wss, WsMsgType.ChannelDelete);

      res.json(updatedServer);
    }
  )
);

router.put(
  "/:serverId/role",
  auth(Flags.EditServers),
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
          languageCode: "en",
          currency: {
            connectOrCreate: {
              create: {
                code: "USD",
                apiValue: "US",
                name: "$ Dollar (USD)",
                inFrontOfPrice: "$",
              },
              where: { code: "USD" },
            },
          },
        },
      });

      broadcastWss(req.wss, WsMsgType.RoleModify);

      res.json(updatedServer);
    }
  )
);

router.delete(
  "/:serverId/role",
  auth(Flags.EditServers),
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

      const updatedServer = await prisma.server.update({
        where: { id: serverId },
        data: {
          roleId: null,
        },
      });

      if (!updatedServer)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "Server not found",
        });

      broadcastWss(req.wss, WsMsgType.RoleDelete);

      res.json(updatedServer);
    }
  )
);

router.put(
  "/:serverId/thread",
  auth(Flags.EditServers),
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
          languageCode: "en",
          currency: {
            connectOrCreate: {
              create: {
                code: "USD",
                apiValue: "US",
                name: "$ Dollar (USD)",
                inFrontOfPrice: "$",
              },
              where: { code: "USD" },
            },
          },
        },
      });

      broadcastWss(req.wss, WsMsgType.ThreadModify);

      res.json(updatedServer);
    }
  )
);

router.delete(
  "/:serverId/thread",
  auth(Flags.EditServers),
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

      const updatedServer = await prisma.server.update({
        where: { id: serverId },
        data: {
          threadId: null,
          channelId: null,
          webhookId: null,
          webhookToken: null,
        },
      });

      if (!updatedServer)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "Server not found",
        });

      broadcastWss(req.wss, WsMsgType.ThreadDelete);

      res.json(updatedServer);
    }
  )
);

router.put(
  "/:serverId/language",
  auth(Flags.EditServers),
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
          currency: {
            connectOrCreate: {
              create: {
                code: "USD",
                apiValue: "US",
                name: "$ Dollar (USD)",
                inFrontOfPrice: "$",
              },
              where: { code: "USD" },
            },
          },
        },
        update: {
          languageCode,
        },
      });

      broadcastWss(req.wss, WsMsgType.LanguageModify);

      res.json(updatedServer);
    }
  )
);

router.put(
  "/:serverId/currency",
  auth(Flags.EditServers),
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

      const currency = await prisma.currency.findUnique({
        where: { code: currencyCode },
      });

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
          currency: {
            connect: { id: currency.id },
          },
        },
        update: {
          currency: {
            connect: { id: currency.id },
          },
        },
        include: {
          currency: true,
        },
      });

      broadcastWss(req.wss, WsMsgType.CurrencyModify);

      res.json(updatedServer);
    }
  )
);

export const serverRouter = router;

import prisma from "../prisma";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { discordIdSchema } from "../utils/jsonfix";
import { withValidation } from "../utils/withValidation";
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
          serverId: discordIdSchema,
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
          serverId: discordIdSchema,
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

      const start = Date.now();

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

      const end = Date.now();

      console.info(`Updated server ${serverId} in ${end - start}ms`);

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
          serverId: discordIdSchema,
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
          serverId: discordIdSchema,
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
          serverId: discordIdSchema,
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
          serverId: discordIdSchema,
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
          serverId: discordIdSchema,
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

      res.json(updatedServer);
    }
  )
);

router.put(
  "/:serverId/language",
  auth(Flags.EditServers),
  withValidation(
    {
      body: z.object({
        languageCode: z.string(),
      }),
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

      res.json(updatedServer);
    }
  )
);

router.put(
  "/:serverId/currency",
  auth(Flags.EditServers),
  withValidation(
    {
      body: z.object({
        currencyCode: z.string(),
      }),
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

      res.json(updatedServer);
    }
  )
);

export const serverRouter = router;

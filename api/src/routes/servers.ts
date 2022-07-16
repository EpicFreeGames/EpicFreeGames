import { Router } from "express";
import { z } from "zod";
import { prisma } from "..";
import { auth, botAuth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get(
  "/:serverId",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
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

      return res.send(server);
    }
  )
);

router.put(
  "/:serverId/channel",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
      body: z.object({
        channelId: z.string(),
        webhookId: z.string(),
        webhookToken: z.string(),
      }),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { channelId, webhookId, webhookToken } = req.body;

      const server = await prisma.server.upsert({
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
        },
      });

      return res.send(server);
    }
  )
);

router.put(
  "/:serverId/channel",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
      body: z.object({
        channelId: z.string(),
        webhookId: z.string(),
        webhookToken: z.string(),
      }),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { channelId, webhookId, webhookToken } = req.body;

      const server = await prisma.server.upsert({
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
        },
      });

      return res.send(server);
    }
  )
);

router.delete(
  "/:serverId/channel",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
    },
    async (req, res) => {
      const { serverId } = req.params;

      await prisma.server.update({
        where: { id: serverId },
        data: {
          channelId: null,
          webhookId: null,
          webhookToken: null,
        },
      });

      return res.status(204);
    }
  )
);

router.put(
  "/:serverId/role",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
      body: z.object({
        roleId: z.string(),
      }),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { roleId } = req.body;

      const server = await prisma.server.upsert({
        where: { id: serverId },
        update: {
          roleId,
        },
        create: {
          id: serverId,
          roleId,
        },
      });

      return res.send(server);
    }
  )
);

router.delete(
  "/:serverId/role",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
    },
    async (req, res) => {
      const { serverId } = req.params;

      await prisma.server.update({
        where: { id: serverId },
        data: {
          roleId: null,
        },
      });

      return res.status(204);
    }
  )
);

router.put(
  "/:serverId/thread",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
      body: z.object({
        threadId: z.string(),
        channelId: z.string(),
        webhookId: z.string(),
        webhookToken: z.string(),
      }),
    },
    async (req, res) => {
      const { serverId } = req.params;

      const { threadId, channelId, webhookId, webhookToken } = req.body;

      const server = await prisma.server.upsert({
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

      return res.send(server);
    }
  )
);

router.delete(
  "/:serverId/thread",
  botAuth,
  withValidation(
    {
      params: z.object({
        serverId: z.string(),
      }),
      body: z.object({
        threadId: z.string(),
        channelId: z.string(),
        webhookId: z.string(),
        webhookToken: z.string(),
      }),
    },
    async (req, res) => {
      const { serverId } = req.params;
      const { threadId, channelId, webhookId, webhookToken } = req.body;

      const server = await prisma.server.upsert({
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

      return res.send(server);
    }
  )
);

router.get("/counts", auth(Flags.GetServers), async (req, res) => {
  const [total, sendable, hasOnlyChannel, hasWebhook, hasRole] =
    await prisma.$transaction([
      // total
      prisma.server.count(),
      // sendable
      prisma.server.count({
        where: {
          channelId: {
            not: null,
          },
        },
      }),
      // has only channel
      prisma.server.count({
        where: {
          channelId: {
            not: null,
          },
          webhookId: null,
          webhookToken: null,
        },
      }),
      // has webhook
      prisma.server.count({
        where: {
          NOT: {
            channelId: null,
            webhookId: null,
            webhookToken: null,
          },
        },
      }),
      // has role
      prisma.server.count({
        where: {
          roleId: {
            not: null,
          },
        },
      }),
    ]);

  return res.send({
    total,
    sendable,
    hasOnlyChannel,
    hasWebhook,
    hasRole,
  });
});

export const serverRouter = router;

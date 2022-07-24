import { prisma } from "..";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
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
          serverId: z.string(),
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
          serverId: z.string(),
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
        },
      });

      res.json(updatedServer);
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
          serverId: z.string(),
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
        },
      });

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
          serverId: z.string(),
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
          serverId: z.string(),
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
          serverId: z.string(),
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
          serverId: z.string(),
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
          serverId: z.string(),
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

      res.json(updatedServer);
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

  res.send({
    total,
    sendable,
    hasOnlyChannel,
    hasWebhook,
    hasRole,
  });
});

export const serverRouter = router;

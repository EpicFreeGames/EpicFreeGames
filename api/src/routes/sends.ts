import { prisma } from "..";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { withValidation } from "../utils/withValidation";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.get(
  "/to-send/",
  auth(Flags.GetServers, Flags.GetGames),
  withValidation(
    {
      query: z.object({
        sendingId: z.string().optional(),
      }),
    },
    async (req, res) => {
      const { sendingId } = req.query;

      let noHook = await prisma.server.findMany({
        where: { webhookId: null, webhookToken: null, channelId: { not: null } },
        include: { currency: true },
      });

      let hook = await prisma.server.findMany({
        where: { webhookId: { not: null }, webhookToken: { not: null }, channelId: { not: null } },
        include: { currency: true },
      });

      const freeGames = await prisma.game.findMany({
        where: {
          start: {
            lt: new Date(),
          },
          end: {
            gt: new Date(),
          },
        },
        include: {
          prices: true,
        },
      });

      if (sendingId) {
        const sends = await prisma.sendingLog.findMany({
          where: { sendingId, success: true },
        });

        if (sends?.length) {
          const serverIds = sends.map((s) => s.serverId);
          noHook = noHook.filter((s) => !serverIds.includes(s.id));
          hook = hook.filter((s) => !serverIds.includes(s.id));
        }
      }

      if (!noHook?.length && !hook?.length)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "No servers found or all got filtered out",
        });

      res.json({
        servers: {
          noHook,
          hook,
        },
        games: freeGames,
      });
    }
  )
);

router.post(
  "/sends/logs",
  auth(Flags.AddSendingLogs),
  withValidation(
    {
      body: z.object({
        serverId: z.string(),
        sendingId: z.string(),
        type: z.string(),
        result: z.string(),
        success: z.boolean(),
      }),
    },
    async (req, res) => {
      const addedLog = await prisma.sendingLog.create({
        data: req.body,
      });

      res.send(addedLog);
    }
  )
);

export const sendsRouter = router;

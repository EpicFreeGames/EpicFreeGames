import { config } from "../config";
import prisma from "../prisma";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { withValidation } from "../utils/withValidation";
import axios from "axios";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.get("/", auth(Flags.GetSendings), async (req, res) => {
  const sends = await prisma.sending.findMany({
    include: { games: true },
  });

  res.json(sends);
});

router.get(
  "/:sendingId",
  auth(Flags.GetSendings),
  withValidation(
    {
      params: z.object({
        sendingId: z.string(),
      }),
    },
    async (req, res) => {
      const { sendingId } = req.params;

      const sending = await prisma.sending.findUnique({
        where: { id: sendingId },
        include: { games: true },
      });

      if (!sending)
        return res
          .status(404)
          .json({ statusCode: 404, error: "Not found", message: "Sending not found" });

      res.json(sending);
    }
  )
);

router.patch(
  "/:sendingId",
  auth(Flags.GetSendings),
  withValidation(
    {
      params: z.object({
        sendingId: z.string(),
      }),
      body: z.object({
        gameIds: z.array(z.string()),
      }),
    },
    async (req, res) => {
      const { sendingId } = req.params;
      const { gameIds } = req.body;

      const updatedSending = await prisma.sending.update({
        where: { id: sendingId },
        data: {
          games: {
            set: gameIds.map((gameId) => ({ id: gameId })),
          },
        },
        include: { games: true },
      });

      if (!updatedSending)
        return res
          .status(404)
          .json({ statusCode: 404, error: "Not found", message: "Sending not found" });

      res.json(updatedSending);
    }
  )
);

router.post(
  "/",
  auth(Flags.AddSendings),
  withValidation(
    {
      body: z.object({
        gameIds: z.array(z.string()),
      }),
    },
    async (req, res) => {
      const { gameIds } = req.body;

      const games = await prisma.game.findMany({ where: { id: { in: gameIds } } });

      const actualGameIds = games.map((g) => g.id);
      const missingGameIds = gameIds.filter((id) => !actualGameIds.includes(id));

      if (missingGameIds.length)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: `Games with ids ${missingGameIds.join(", ")} not found`,
        });

      const sending = await prisma.sending.create({
        data: {
          status: "IDLE",
          games: {
            connect: games.map((g) => ({ id: g.id })),
          },
        },
      });

      res.json(sending);
    }
  )
);

router.post(
  "/:sendingId/send",
  auth(Flags.Send),
  withValidation(
    {
      params: z.object({
        sendingId: z.string(),
      }),
    },
    async (req, res) => {
      const { sendingId } = req.params;

      const sending = await prisma.sending.findUnique({
        where: { id: sendingId },
        include: { games: { include: { prices: true } }, logs: true },
      });

      if (!sending)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "Sending not found",
        });

      let noHook = await prisma.server.findMany({
        where: { webhookId: null, webhookToken: null, channelId: { not: null } },
        include: { currency: true },
      });

      let hook = await prisma.server.findMany({
        where: { webhookId: { not: null }, webhookToken: { not: null }, channelId: { not: null } },
        include: { currency: true },
      });

      if (sending.logs?.length) {
        const serverIds = sending.logs.map((s) => s.serverId);
        noHook = noHook.filter((s) => !serverIds.includes(s.id));
        hook = hook.filter((s) => !serverIds.includes(s.id));
      }

      if (!noHook?.length && !hook?.length)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "No servers found or all got filtered out",
        });

      await axios({
        method: "POST",
        url: config.SENDER_URL,
        headers: {
          Authorization: config.SENDER_AUTH,
        },
        data: {
          sendingId,
          servers: {
            noHook,
            hook,
          },
          games: sending.games,
        },
      });
    }
  )
);

router.post(
  "/logs",
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

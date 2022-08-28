import { Router } from "express";
import { z } from "zod";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import { config } from "../config";
import prisma from "../data/prisma";
import { prismaUpdateCatcher } from "../data/prismaUpdateCatcher";
import redis from "../data/redis";
import { addLocaleInfoToServers } from "../utils/addLocaleInfoToServers";
import { bigintSchema } from "../utils/jsonfix";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get("/", endpointAuth(Flags.GetSendings), async (req, res) => {
  let sends = await prisma.sending.findMany({
    include: { games: true },
  });

  const withSuccessesFailures = await Promise.all(
    sends.map(async (sending) => ({
      ...sending,
      successes: Number(await redis.get(`sending:${sending.id}:successes`)),
      failures: Number(await redis.get(`sending:${sending.id}:failures`)),
    }))
  );

  res.json(withSuccessesFailures);
});

router.get(
  "/servers-to-send",
  endpointAuth(Flags.GetServers, Flags.GetSendings, Flags.GetSendingLogs),
  withValidation(
    {
      query: z
        .object({
          after: bigintSchema.optional(),
          sendingId: z.string().optional(),
        })
        .strict(),
    },
    async (req, res) => {
      const { after, sendingId } = req.query;

      const servers = await prisma.server.findMany({
        include: { sendingLogs: true },
        orderBy: {
          id: "asc",
        },
        where: {
          channelId: { not: null },
          ...(sendingId ? { sendingLogs: { none: { sendingId } } } : {}),
        },
        take: 10,
        ...(after
          ? {
              cursor: {
                id: after,
              },
              skip: 1,
            }
          : {}),
      });

      await redis.set(`sending:${sendingId}:target`, servers.length);

      res.json(addLocaleInfoToServers(...servers));
    }
  )
);

router.get(
  "/:sendingId",
  endpointAuth(Flags.GetSendings),
  withValidation(
    {
      params: z
        .object({
          sendingId: z.string(),
        })
        .strict(),
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

      const successes = await redis.get(`sending:${sendingId}:successes`);
      const failures = await redis.get(`sending:${sendingId}:failures`);

      res.json({ ...sending, successes, failures });
    }
  )
);

router.patch(
  "/:sendingId",
  endpointAuth(Flags.EditSendings, Flags.GetSendings),
  withValidation(
    {
      params: z
        .object({
          sendingId: z.string(),
        })
        .strict(),
      body: z
        .object({
          gameIds: z.array(z.string()),
        })
        .strict(),
    },
    async (req, res) => {
      const { sendingId } = req.params;
      const { gameIds } = req.body;

      const updatedSending = await prisma.sending
        .update({
          where: { id: sendingId },
          data: {
            games: {
              set: gameIds.map((gameId) => ({ id: gameId })),
            },
          },
          include: { games: true },
        })
        .catch(prismaUpdateCatcher);

      if (!updatedSending)
        return res
          .status(404)
          .json({ statusCode: 404, error: "Not found", message: "Sending not found" });

      res.json(updatedSending);
    }
  )
);

router.delete(
  "/:sendingId",
  endpointAuth(Flags.DeleteSendings, Flags.GetSendings),
  withValidation(
    {
      params: z
        .object({
          sendingId: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { sendingId } = req.params;

      const deletedSending = await prisma.sending.delete({
        where: { id: sendingId },
      });

      if (!deletedSending)
        return res
          .status(404)
          .json({ statusCode: 404, error: "Not found", message: "Sending not found" });

      res.status(204).send();
    }
  )
);

router.post(
  "/",
  endpointAuth(Flags.AddSendings, Flags.GetSendings),
  withValidation(
    {
      body: z
        .object({
          gameIds: z.array(z.string()),
        })
        .strict(),
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
  endpointAuth(Flags.Send, Flags.GetSendings),
  withValidation(
    {
      params: z
        .object({
          sendingId: z.string(),
        })
        .strict(),
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

      const senderResponse = await fetch(config.SENDER_URL, {
        method: "POST",
        headers: {
          Authorization: config.SENDER_AUTH,
        },
        body: JSON.stringify({
          sendingId,
          games: sending.games,
        }),
      });

      const senderResponseData = await senderResponse.json();
      const status = senderResponse.status || 500;

      if (!senderResponse.ok)
        return res.status(status).send(
          senderResponseData ?? {
            stautsCode: status,
            error: "Sender responded with an error",
            message: "Sender responded with an error",
          }
        );

      await prisma.sending.update({
        where: { id: sendingId },
        data: { status: "SENDING" },
      });

      console.log(JSON.stringify(senderResponseData, null, 2));

      res.status(204).send();
    }
  )
);

router.post(
  "/logs",
  endpointAuth(Flags.AddSendingLogs, Flags.GetSendingLogs),
  withValidation(
    {
      body: z
        .object({
          serverId: bigintSchema,
          sendingId: z.string(),
          type: z.enum(["MESSAGE", "WEBHOOK"]),
          result: z.string(),
          success: z.boolean(),
        })
        .strict(),
    },
    async (req, res) => {
      const addedLog = await prisma.sendingLog.create({
        data: req.body,
      });

      const { success, sendingId } = req.body;
      await redis.incrby(`sending:${sendingId}:${success ? "successes" : "failures"}`, 1);

      res.send(addedLog);

      await updateSendingStatus(sendingId);
    }
  )
);

const updateSendingStatus = async (sendingId: string) => {
  const [successes, failures, target] = await Promise.all([
    Number(await redis.get(`sending:${sendingId}:successes`)),
    Number(await redis.get(`sending:${sendingId}:failures`)),
    Number(await redis.get(`sending:${sendingId}:target`)),
  ]);

  const total = successes + failures;

  const targetReached = total >= target;

  if (targetReached) {
    await prisma.sending
      .update({
        where: { id: sendingId },
        data: { status: "SENT" },
      })
      .catch(prismaUpdateCatcher);
  }
};

export const sendsRouter = router;

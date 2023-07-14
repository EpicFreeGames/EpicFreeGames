import { Router } from "express";
import { z } from "zod";

import { Flags } from "@efg/types";

import { endpointAuth } from "../auth/endpointAuth";
import prisma from "../data/prisma";
import { bigintSchema } from "../utils/jsonfix";
import { withValidation } from "../utils/withValidation";
import { WsMsgType } from "../websocket/types";
import { broadcastWss } from "../websocket/utils";

const router = Router();

router.post(
  "/commands",
  endpointAuth(Flags.AddCommandLogs),
  withValidation(
    {
      body: z
        .object({
          command: z.string(),
          senderId: z.string(),
          serverId: bigintSchema.nullable(),
          error: z.string().nullable(),
        })
        .strict(),
    },
    async (req, res) => {
      const { serverId, ...rest } = req.body;

      await prisma.commandLog.create({
        data: {
          ...rest,
          ...(serverId && {
            server: {
              connectOrCreate: {
                create: { id: serverId },
                where: { id: serverId },
              },
            },
          }),
        },
      });

      broadcastWss(req.wss, WsMsgType.Command, req.body.command);

      return res.status(204).end();
    }
  )
);

export const logRouter = router;

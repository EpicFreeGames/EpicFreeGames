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

router.post(
  "/commands",
  auth(Flags.AddCommandLogs),
  withValidation(
    {
      body: z
        .object({
          command: z.string(),
          senderId: z.string(),
          serverId: bigintSchema,
          error: z.string().nullable(),
        })
        .strict(),
    },
    async (req, res) => {
      const addedLog = await prisma.commandLog.create({
        data: req.body,
      });

      broadcastWss(req.wss, WsMsgType.Command, req.body.command);

      return res.send(addedLog);
    }
  )
);

export const logRouter = router;

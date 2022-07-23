import { Router } from "express";
import { z } from "zod";
import { prisma } from "..";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { withValidation } from "../utils/withValidation";

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
          serverId: z.string(),
          error: z.string().nullable(),
        })
        .strict(),
    },
    async (req, res) => {
      const addedLog = await prisma.commandLog.create({
        data: req.body,
      });

      return res.send(addedLog);
    }
  )
);

router.post(
  "/sends",
  auth(Flags.AddSendingLogs),
  withValidation(
    {
      body: z.object({
        serverId: z.string(),
        sendingId: z.string(),
        type: z.string(),
        result: z.string(),
      }),
    },
    async (req, res) => {
      const addedLog = await prisma.sendingLog.create({
        data: req.body,
      });

      return res.send(addedLog);
    }
  )
);

export const logRouter = router;

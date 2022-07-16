import { Router } from "express";
import { z } from "zod";
import { prisma } from "..";
import { botAuth } from "../utils/auth";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.post(
  "/commands",
  botAuth,
  withValidation(
    {
      body: z.object({
        command: z.string(),
        senderId: z.string(),
        serverId: z.string(),
      }),
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
  botAuth,
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

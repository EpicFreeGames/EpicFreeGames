import prisma from "../prisma";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { discordIdSchema } from "../utils/jsonfix";
import { withValidation } from "../utils/withValidation";
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
          serverId: discordIdSchema,
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

export const logRouter = router;

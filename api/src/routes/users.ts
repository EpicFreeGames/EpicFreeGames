import prisma from "../data/prisma";
import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import { withValidation } from "../utils/withValidation";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.post(
  "/:userId/flags",
  endpointAuth(Flags.EditUsers),
  withValidation(
    {
      params: z
        .object({
          userId: z.string(),
        })
        .strict(),
      body: z
        .object({
          newFlags: z.number(),
        })
        .strict(),
    },
    async (req, res) => {
      const { userId } = req.params;
      const { newFlags } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { flags: newFlags },
      });

      if (!user)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "User not found",
        });

      return res.send(user);
    }
  )
);

router.get("/@me", endpointAuth(), async (req, res) => {
  const userId = req.tokenPayload.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user)
    return res.status(404).send({
      statusCode: 404,
      error: "Not found",
      message: "User not found",
    });

  return res.json(user);
});

export const userRouter = router;

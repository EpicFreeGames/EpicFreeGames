import { prisma } from "..";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { withValidation } from "../utils/withValidation";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.post(
  "/:userId/flags",
  auth(Flags.EditUsers),
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

router.get("/@me", auth(), async (req, res) => {
  const userId = req.session.user!.id;

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

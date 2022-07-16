import { z } from "zod";
import { auth } from "../utils/auth";
import { Router } from "express";
import { prisma } from "..";
import { withValidation } from "../utils/withValidation";
import { Flags } from "../utils/flags";

const router = Router();

router.post(
  "/:userId/flags",
  auth(Flags.EditUsers),
  withValidation(
    {
      params: z.object({
        userId: z.string(),
      }),
      body: z.object({
        newFlags: z.number(),
      }),
    },
    async (req, res) => {
      const { userId } = req.params;
      const { newFlags } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { flags: newFlags },
        select: {
          flags: true,
        },
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

export const userRouter = router;

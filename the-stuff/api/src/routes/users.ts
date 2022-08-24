import { Router } from "express";
import { z } from "zod";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import { invalidateUserLogin } from "../auth/userReLogin";
import prisma from "../data/prisma";
import { prismaUpdateCatcher } from "../data/prismaUpdateCatcher";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.post(
  "/:userId/flags",
  endpointAuth(Flags.EditUsers, Flags.GetServers),
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

      const user = await prisma.user
        .update({
          where: { id: userId },
          data: { flags: newFlags },
        })
        .catch(prismaUpdateCatcher);

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

router.get("/", endpointAuth(Flags.GetUsers), async (req, res) => {
  const users = await prisma.user.findMany();

  return res.json(users);
});

router.post(
  "/",
  endpointAuth(Flags.AddUsers, Flags.GetUsers),
  withValidation(
    {
      body: z.object({
        discordId: z.string(),
        flags: z.number(),
      }),
    },
    async (req, res) => {
      const { discordId, flags } = req.body;

      const user = await prisma.user.create({
        data: {
          discordId,
          flags,
        },
      });

      return res.json(user);
    }
  )
);

router.patch(
  "/:userId",
  endpointAuth(Flags.EditUsers, Flags.GetUsers),
  withValidation(
    {
      params: z
        .object({
          userId: z.string(),
        })
        .strict(),
      body: z
        .object({
          flags: z.number(),
        })
        .strict(),
    },
    async (req, res) => {
      const { userId } = req.params;
      const { flags } = req.body;

      const updatedUser = await prisma.user
        .update({
          where: { id: userId },
          data: { flags },
        })
        .catch(prismaUpdateCatcher);

      if (!updatedUser)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "User not found",
        });

      await invalidateUserLogin(userId);

      return res.send(updatedUser);
    }
  )
);

router.delete(
  "/:userId",
  endpointAuth(Flags.DeleteUsers, Flags.GetUsers),
  withValidation(
    {
      params: z
        .object({
          userId: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { userId } = req.params;

      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      if (!deletedUser)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "User not found",
        });

      res.status(204).send();
    }
  )
);

export const userRouter = router;

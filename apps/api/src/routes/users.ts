import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
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
          data: { flags: newFlags, tokenVersion: uuidv4() },
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
    return res.status(401).json({
      statusCode: 401,
      error: "Unauthorized",
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
        identifier: z.string(),
        flags: z.number(),
      }),
    },
    async (req, res) => {
      const { identifier, flags } = req.body;

      const user = await prisma.user.create({
        data: {
          identifier,
          flags,
          tokenVersion: uuidv4(),
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
          data: { flags, tokenVersion: uuidv4() },
        })
        .catch(prismaUpdateCatcher);

      if (!updatedUser)
        return res.status(404).send({
          statusCode: 404,
          error: "Not found",
          message: "User not found",
        });

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

import { Router } from "express";
import { z } from "zod";
import { prisma } from "..";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { withValidation } from "../utils/withValidation";

export const gameRouter = Router();

gameRouter.get("/", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany();

  res.send(games);
});

gameRouter.get("/free", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      start: {
        lt: new Date(),
      },
      end: {
        gt: new Date(),
      },
    },
  });

  res.send(games);
});

gameRouter.get("/up", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      start: {
        gt: new Date(),
      },
      end: {
        gt: new Date(),
      },
    },
  });

  res.send(games);
});

gameRouter.get("/confirmed", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      confirmed: true,
    },
  });

  res.send(games);
});

gameRouter.get("/not-confirmed", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      confirmed: false,
    },
  });

  res.send(games);
});

gameRouter.put(
  "/",
  auth(Flags.PutGames),
  withValidation(
    {
      body: z.array(
        z.object({
          name: z.string(),
          imageUrl: z.string(),
          start: z.string(),
          end: z.string(),
          path: z.string(),
          prices: z.array(
            z.object({
              value: z.string(),
              currencyCode: z.string(),
            })
          ),
        })
      ),
    },
    async (req, res) => {
      for (const game of req.body) {
        const { prices, ...rest } = game;

        await prisma.game.upsert({
          where: {
            name: game.name,
          },
          update: {
            ...rest,
            prices: {
              upsert: prices.map((price) => ({
                where: {
                  currencyCode: price.currencyCode,
                },
                create: price,
                update: price,
              })),
            },
          },
          create: {
            ...rest,
            displayName: game.name,
            prices: {
              createMany: {
                data: prices,
              },
            },
          },
        });
      }

      res.status(204);
    }
  )
);

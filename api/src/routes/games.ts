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
      confirmed: true,
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

gameRouter.get("/not-confirmed", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      confirmed: false,
    },
  });

  res.send(games);
});

gameRouter.post(
  "/:gameId",
  auth(Flags.EditGames),
  withValidation(
    {
      body: z.object({
        name: z.string().optional(),
        displayName: z.string().optional(),
        imageUrl: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
        path: z.string().optional(),
        confirmed: z.boolean().optional(),
        prices: z
          .array(
            z.object({
              value: z.number(),
              currencyCode: z.string(),
            })
          )
          .optional(),
      }),
      params: z.object({
        gameId: z.string(),
      }),
    },
    async (req, res) => {
      const game = await prisma.game.update({
        where: {
          id: req.params.gameId,
        },
        data: {
          ...req.body,
        },
      });

      if (!game) {
        return res.status(404).json({
          statusCode: 404,
          error: "Not Found",
          message: "Game not found",
        });
      }

      res.send(game);
    }
  )
);

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
              value: z.number(),
              currencyCode: z.string(),
            })
          ),
        })
      ),
    },
    async (req, res) => {
      const excludedPriceCodes: Map<string, string[]> = new Map();

      for (const game of req.body) {
        const { prices, ...rest } = game;

        const availableCurrencyCodes = (await prisma.currency.findMany()).map(
          (c) => c.code
        );

        const goodPrices = prices.filter((p) => {
          if (!availableCurrencyCodes.includes(p.currencyCode)) {
            excludedPriceCodes.set(game.name, [
              ...(excludedPriceCodes.get(game.name) || []),
              p.currencyCode,
            ]);
            return false;
          }

          return true;
        });

        await prisma.game.upsert({
          where: {
            name: game.name,
          },
          update: {
            ...rest,
            prices: {
              upsert: goodPrices.map((price) => ({
                where: {
                  currencyCode: price.currencyCode,
                },
                create: {
                  currencyCode: price.currencyCode,
                  value: price.value,
                },
                update: {
                  value: price.value,
                },
              })),
            },
          },
          create: {
            ...rest,
            displayName: game.name,
            prices: {
              connectOrCreate: goodPrices.map((price) => ({
                where: {
                  currencyCode: price.currencyCode,
                },
                create: {
                  currencyCode: price.currencyCode,
                  value: price.value,
                },
              })),
            },
          },
        });
      }

      if (excludedPriceCodes.size)
        return res.status(200).json({
          statusCode: 200,
          message: "Some prices were excluded due to non-existing currency",
          excluded: Array.from(excludedPriceCodes.entries()),
        });

      res.status(204).send();
    }
  )
);

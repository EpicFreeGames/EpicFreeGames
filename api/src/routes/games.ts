import prisma from "../data/prisma";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { withValidation } from "../utils/withValidation";
import { GamePrice } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.get("/", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({ include: { prices: true } });

  res.send(games);
});

router.get("/free", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      start: {
        lt: new Date(),
      },
      end: {
        gt: new Date(),
      },
    },
    include: {
      prices: true,
    },
  });

  res.send(games);
});

router.get("/up", auth(Flags.GetGames), async (req, res) => {
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
    include: {
      prices: true,
    },
  });

  res.send(games);
});

router.get("/not-confirmed", auth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      confirmed: false,
    },
    include: {
      prices: true,
    },
  });

  res.send(games);
});

router.get(
  "/:gameId",
  auth(Flags.GetGames),
  withValidation(
    {
      params: z.object({
        gameId: z.string(),
      }),
    },
    async (req, res) => {
      const { gameId } = req.params;

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
        include: { prices: true },
      });

      res.send(game);
    }
  )
);

router.patch(
  "/:gameId",
  auth(Flags.EditGames),
  withValidation(
    {
      body: z
        .object({
          name: z.string().optional(),
          displayName: z.string().optional(),
          imageUrl: z.string().optional(),
          start: z
            .string()
            .transform((v) => new Date(v))
            .optional(),
          end: z
            .string()
            .transform((v) => new Date(v))
            .optional(),
          path: z.string().optional(),
          confirmed: z.boolean().optional(),
        })
        .strict(),
      params: z
        .object({
          gameId: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const game = await prisma.game.update({
        where: {
          id: req.params.gameId,
        },
        data: req.body,
        include: { prices: true },
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

router.post(
  "/",
  auth(Flags.AddGames),
  withValidation(
    {
      body: z
        .object({
          name: z.string(),
          displayName: z.string(),
          imageUrl: z.string(),
          start: z.string(),
          end: z.string(),
          path: z.string(),
          usdPrice: z.string(),
          priceValue: z.number(),
        })
        .strict(),
    },
    async (req, res) => {
      const { usdPrice, priceValue, start, end, ...rest } = req.body;

      const existingGame = await prisma.game.findUnique({
        where: { name: rest.name },
      });

      if (existingGame)
        return res.status(409).json({
          statusCode: 409,
          error: "Conflict",
          message: "A game with the same name already exists",
        });

      const createdGame = await prisma.game.create({
        data: {
          ...rest,
          start: new Date(start),
          end: new Date(end),
          confirmed: false,
          prices: {
            create: {
              value: Number(priceValue),
              formattedValue: usdPrice,
              currencyCode: "USD",
            },
          },
        },
        include: { prices: true },
      });

      res.send(createdGame);
    }
  )
);

router.put(
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

        const availableCurrencies = await prisma.currency.findMany();

        const formattedPrices = prices.reduce((acc, p) => {
          const currency = availableCurrencies.find((c) => c.code === p.currencyCode);

          if (currency) {
            acc.push({
              ...p,
              formattedValue: `${currency.inFrontOfPrice}${p.value}${currency.afterPrice}`,
            });
          } else {
            // if no currency, dont push to result arr and add to excluded
            excludedPriceCodes.set(game.name, [
              ...(excludedPriceCodes.get(game.name) || []),
              p.currencyCode,
            ]);
          }

          return acc;
        }, [] as Omit<GamePrice, "id" | "gameId">[]);

        await prisma.game.upsert({
          where: {
            name: game.name,
          },
          update: {
            ...rest,
            prices: {
              upsert: formattedPrices.map((price) => ({
                where: {},
                create: price,
                update: price,
              })),
            },
          },
          create: {
            ...rest,
            displayName: game.name,
            prices: {
              connectOrCreate: formattedPrices.map((price) => ({
                where: {},
                create: price,
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

router.delete(
  "/:gameId",
  auth(Flags.DeleteGames),
  withValidation(
    {
      params: z.object({
        gameId: z.string(),
      }),
    },
    async (req, res) => {
      const gameId = req.params.gameId;

      const deletedGame = await prisma.game.delete({ where: { id: gameId } });

      if (!deletedGame) {
        return res.status(404).json({
          statusCode: 404,
          error: "Not Found",
          message: "Game not found",
        });
      }

      res.status(204).send();
    }
  )
);

export const gameRouter = router;

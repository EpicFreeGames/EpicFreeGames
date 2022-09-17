import { Router } from "express";
import { z } from "zod";

import { currencies } from "@efg/i18n";
import { Flags } from "@efg/types";

import { endpointAuth } from "../auth/endpointAuth";
import { gameStores } from "../data/gameStores";
import prisma from "../data/prisma";
import { prismaUpdateCatcher } from "../data/prismaUpdateCatcher";
import { addStuffToGames, addStufftoGame } from "../utils/addStuffToGames";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get("/", endpointAuth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({ include: { prices: true } });

  res.json(addStuffToGames(games));
});

router.get("/free", endpointAuth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      confirmed: true,
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

  res.json(addStuffToGames(games));
});

router.get("/up", endpointAuth(Flags.GetGames), async (req, res) => {
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

  res.json(addStuffToGames(games));
});

router.get("/not-confirmed", endpointAuth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      confirmed: false,
    },
    include: {
      prices: true,
    },
  });

  res.json(addStuffToGames(games));
});

router.get("/confirmed", endpointAuth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({
    where: {
      confirmed: true,
    },
    include: {
      prices: true,
    },
  });

  res.json(addStuffToGames(games));
});

router.get(
  "/:gameId",
  endpointAuth(Flags.GetGames),
  withValidation(
    {
      params: z.object({
        gameId: z.string(),
      }),
    },
    async (req, res) => {
      const { gameId } = req.params;

      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { prices: true },
      });

      if (!game || !game.confirmed)
        return res
          .status(404)
          .json({ statusCode: 404, error: "Not found", message: "Game not found" });

      res.json(addStufftoGame(game));
    }
  )
);

router.patch(
  "/:gameId",
  endpointAuth(Flags.EditGames, Flags.GetGames),
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
      const game = await prisma.game
        .update({
          where: {
            id: req.params.gameId,
          },
          data: req.body,
          include: { prices: true },
        })
        .catch(prismaUpdateCatcher);

      if (!game) {
        return res.status(404).json({
          statusCode: 404,
          error: "Not Found",
          message: "Game not found",
        });
      }

      res.json(addStufftoGame(game));
    }
  )
);

router.post(
  "/",
  endpointAuth(Flags.AddGames, Flags.GetGames),
  withValidation(
    {
      body: z
        .object({
          name: z.string().min(1),
          displayName: z.string().min(1),
          imageUrl: z.string().min(1),
          start: z.string().min(1),
          end: z.string().min(1),
          path: z.string().min(1),
          usdPrice: z.string().min(1),
          storeId: z.string().min(1),
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

      res.json(addStufftoGame(createdGame));
    }
  )
);

router.put(
  "/",
  endpointAuth(Flags.PutGames),
  withValidation(
    {
      body: z.array(
        z.object({
          name: z.string().min(1),
          imageUrl: z.string().min(1),
          start: z.string().min(1),
          end: z.string().min(1),
          path: z.string().min(1),
          prices: z.array(
            z.object({
              value: z.number(),
              formattedValue: z.string().min(1),
              currencyCode: z.string().min(1),
            })
          ),
          storeId: z.string().min(1),
        })
      ),
    },
    async (req, res) => {
      /**
       * Map<GameName, CurrencyCodes>
       */
      const excludedPriceCodes: Map<string, string[]> = new Map();
      const excludedGames: { name: string; reason: string }[] = [];

      const dbGames = await prisma.game.findMany({ include: { prices: true } });

      for (const game of req.body) {
        const { prices, start, end, path, ...restOfGame } = game;
        const dbGame = dbGames.find((g) => g.name === restOfGame.name);
        const dbStore = gameStores.find((s) => s.id === restOfGame.storeId);

        if (!dbStore) {
          excludedGames.push({ name: restOfGame.name, reason: "Store not found" });
          continue;
        }

        const pricesToSave = prices
          .filter((price) => {
            const currency = currencies.get(price.currencyCode);

            if (!currency) {
              excludedPriceCodes.set(restOfGame.name, [
                ...(excludedPriceCodes.get(restOfGame.name) || []),
                price.currencyCode,
              ]);
              return false;
            }

            return true;
          })
          .map((price) => ({
            ...price,
            id: dbGame?.prices.find((p) => p.currencyCode === price.currencyCode)?.id ?? "new",
          }));

        const hasPrices = !!pricesToSave?.length;

        await prisma.game.upsert({
          where: {
            name: game.name,
          },
          update: {
            ...restOfGame,
            start: new Date(start),
            end: new Date(end),
            ...(hasPrices && {
              prices: {
                upsert: pricesToSave.map(({ id, ...restOfGame }) => ({
                  where: { id: id },
                  create: restOfGame,
                  update: restOfGame,
                })),
              },
            }),
          },
          create: {
            ...restOfGame,
            displayName: game.name,
            start: new Date(start),
            end: new Date(end),
            path,
            ...(hasPrices && {
              prices: {
                createMany: {
                  data: pricesToSave.map(({ id, ...restOfGame }) => ({ ...restOfGame })),
                },
              },
            }),
          },
          include: {
            prices: true,
          },
        });
      }

      if (excludedPriceCodes.size || excludedGames.length)
        return res.status(200).json({
          statusCode: 200,
          currencyExcluded: Array.from(excludedPriceCodes.entries()),
          gamesExcluded: excludedGames,
        });

      res.status(204).send();
    }
  )
);

router.delete(
  "/:gameId",
  endpointAuth(Flags.DeleteGames, Flags.GetGames),
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

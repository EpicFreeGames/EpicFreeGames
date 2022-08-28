import { Router } from "express";
import { z } from "zod";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import prisma from "../data/prisma";
import { prismaUpdateCatcher } from "../data/prismaUpdateCatcher";
import { currencies } from "../i18n/currencies";
import { addStatusToGames } from "../utils/addStatusToGames";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get("/", endpointAuth(Flags.GetGames), async (req, res) => {
  const games = await prisma.game.findMany({ include: { prices: true } });

  res.json(addStatusToGames(...games));
});

router.get("/free", endpointAuth(Flags.GetGames), async (req, res) => {
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

  res.json(addStatusToGames(...games));
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

  res.json(addStatusToGames(...games));
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

  res.json(addStatusToGames(...games));
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
        where: {
          id: gameId,
        },
        include: { prices: true },
      });

      if (!game)
        return res
          .status(404)
          .json({ statusCode: 404, error: "Not found", message: "Game not found" });

      res.json(addStatusToGames(game));
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

      res.json(addStatusToGames(game));
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

      res.json(addStatusToGames(createdGame));
    }
  )
);

router.put(
  "/",
  endpointAuth(Flags.PutGames, Flags.GetGames),
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
              formattedValue: z.string(),
              currencyCode: z.string(),
            })
          ),
        })
      ),
    },
    async (req, res) => {
      /**
       * Map<GameName, CurrencyCodes>
       */
      const excludedPriceCodes: Map<string, string[]> = new Map();

      const dbGames = await prisma.game.findMany({ include: { prices: true } });

      for (const game of req.body) {
        const { prices, start, end, ...rest } = game;
        const dbGame = dbGames.find((g) => g.name === rest.name);

        const pricesToSave = prices
          .filter((price) => {
            const currency = currencies.get(price.currencyCode);

            if (!currency) {
              excludedPriceCodes.set(rest.name, [
                ...(excludedPriceCodes.get(rest.name) || []),
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

        await prisma.game.upsert({
          where: {
            name: game.name,
          },
          update: {
            ...rest,
            start: new Date(start),
            end: new Date(end),
            prices: {
              upsert: pricesToSave.map(({ id, ...rest }) => ({
                where: {
                  id: id,
                },
                create: rest,
                update: rest,
              })),
            },
          },
          create: {
            ...rest,
            displayName: game.name,
            start: new Date(start),
            end: new Date(end),
            prices: { createMany: { data: pricesToSave } },
          },
          include: {
            prices: true,
          },
        });

        //   if (upsertedGame.prices.length) {
        //     await prisma.$transaction(
        //       pricesToSave.map((price) =>
        //         prisma.gamePrice.update({
        //           where: {
        //             id: upsertedGame.prices.find((p) => p.currencyCode === price.currencyCode)?.id,
        //           },
        //           data: price,
        //         })
        //       )
        //     );
        //   } else {
        //     await prisma.gamePrice.createMany({
        //       data: pricesToSave.map((p) => ({ ...p, gameId: upsertedGame.id })),
        //     });
        //   }
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

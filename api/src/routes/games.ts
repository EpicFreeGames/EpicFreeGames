import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { zodToJson } from "../utils/zodToJson";

const putGamesSchema = {
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
};

export const gameRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/", {
    preHandler: auth(Flags.GetGames),
    handler: async (request, reply) => {
      const games = await fastify.prisma.game.findMany();

      reply.send(games);
    },
  });

  fastify.get("/free", {
    preHandler: auth(Flags.GetGames),
    handler: async (request, reply) => {
      const games = await fastify.prisma.game.findMany({
        where: {
          start: {
            lt: new Date(),
          },
          end: {
            gt: new Date(),
          },
        },
      });

      reply.send(games);
    },
  });

  fastify.get("/up", {
    preHandler: auth(Flags.GetGames),
    handler: async (request, reply) => {
      const games = await fastify.prisma.game.findMany({
        where: {
          start: {
            gt: new Date(),
          },
          end: {
            gt: new Date(),
          },
        },
      });

      reply.send(games);
    },
  });

  fastify.get("/confirmed", {
    preHandler: auth(Flags.GetGames),
    handler: async (request, reply) => {
      const games = await fastify.prisma.game.findMany({
        where: {
          confirmed: true,
        },
      });

      reply.send(games);
    },
  });

  fastify.get("/not-confirmed", {
    preHandler: auth(Flags.GetGames),
    handler: async (request, reply) => {
      const games = await fastify.prisma.game.findMany({
        where: {
          confirmed: false,
        },
      });

      reply.send(games);
    },
  });

  fastify.put<{
    Body: z.infer<typeof putGamesSchema.body>;
  }>("/", {
    preHandler: auth(Flags.PutGames),
    schema: {
      body: zodToJson(putGamesSchema.body),
    },
    handler: async (request, reply) => {
      for (const game of request.body) {
        const { prices, ...rest } = game;

        await fastify.prisma.game.upsert({
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

      reply.status(204);
    },
  });
};

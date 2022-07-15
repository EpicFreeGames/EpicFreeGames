import { PrismaClient } from "@prisma/client";
import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

const prismaClient: FastifyPluginCallback = async (fastify, options, next) => {
  if (fastify.prisma) {
    return next(new Error("prisma-plugin has been defined before"));
  }

  const prisma = new PrismaClient();
  await prisma.$connect();

  fastify
    .decorate("prisma", prisma)
    .decorateRequest("prisma", { getter: () => fastify.prisma })
    .addHook("onClose", async (fastify, done) => {
      await fastify.prisma.$disconnect();
      done();
    });

  next();
};

export const prismaPlugin = fp(prismaClient, {
  name: "prisma-plugin",
});

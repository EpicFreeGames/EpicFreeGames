import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { auth } from "../utils/auth";
import { zodToJson } from "../utils/zodToJson";
import { Flags } from "../utils/flags";

const updateUserFlagsSchema = {
  params: z.object({
    userId: z.string(),
  }),

  body: z.object({
    newFlags: z.number(),
  }),
};

export const userRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post<{
    Params: z.infer<typeof updateUserFlagsSchema.params>;
    Body: z.infer<typeof updateUserFlagsSchema.body>;
  }>("/:userId/flags", {
    schema: {
      params: zodToJson(updateUserFlagsSchema.params),
      body: zodToJson(updateUserFlagsSchema.body),
    },
    preHandler: auth(Flags.EditUsers),
    handler: async (request, reply) => {
      const { userId } = request.params;
      const { newFlags } = request.body;

      await fastify.prisma.user.update({
        where: { id: userId },
        data: { flags: newFlags },
      });

      return reply.status(204);
    },
  });
};

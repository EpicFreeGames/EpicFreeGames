import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { safeEqual } from "../utils/crypto";
import { getConfirmationUrl } from "../utils/emailVerification";
import { zodToJson } from "../utils/zodToJson";

const verifyEmailSchema = {
  querystring: z.object({
    userId: z.string(),
  }),
};

export const emailRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get<{
    Querystring: z.infer<typeof verifyEmailSchema.querystring>;
  }>("/verify", {
    schema: {
      querystring: zodToJson(verifyEmailSchema.querystring),
    },
    handler: async (request, reply) => {
      const { userId } = request.query;

      const expectedUrl = getConfirmationUrl(userId);
      const actualUrl = `${request.protocol}://${request.hostname}${request.url}`;

      if (!safeEqual(expectedUrl, actualUrl))
        return reply.send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid verification url",
        });

      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.emailVerifiedAt)
        return reply.send({
          statusCode: 400,
          error: "Bad Request",
          message: "User not found or is already verified",
        });

      await fastify.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          emailVerifiedAt: new Date(),
        },
      });

      return reply.send({
        statusCode: 200,
        message: "Email verified! 🎉",
      });
    },
  });
};

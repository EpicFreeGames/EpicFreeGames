import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { config } from "../config";
import { registerMail } from "../mails/register";
import { comparePassword, hashPassword } from "../utils/crypto";
import { getConfirmationUrl } from "../utils/emailVerification";
import {
  verifyRefreshJwt,
  encryptAccessJwt,
  encryptRefreshJwt,
} from "../utils/jwt";
import { zodToJson } from "../utils/zodToJson";

const loginShema = {
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
};

export const authRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post<{
    Body: z.infer<typeof loginShema.body>;
  }>("/login", {
    schema: {
      body: zodToJson(loginShema.body),
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;

      const user = await fastify.prisma.user.findUnique({
        where: { email },
      });

      if (!user)
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid credentials",
        });

      const isValidPass = await comparePassword(password, user.password);

      if (!isValidPass)
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid credentials",
        });

      const dbRefreshToken = await fastify.prisma.refreshToken.create({
        data: {},
      });

      return reply.send({
        accessToken: await encryptAccessJwt({
          userId: user.id,
          email: user.email,
          flags: user.flags,
        }),
        refreshToken: await encryptRefreshJwt({
          userId: user.id,
          email: user.email,
          flags: user.flags,
          jti: dbRefreshToken.id,
        }),
      });
    },
  });

  fastify.post<{
    Body: z.infer<typeof loginShema.body>;
  }>("/register", {
    schema: {
      body: zodToJson(loginShema.body),
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;

      const emailExists = await fastify.prisma.user.findUnique({
        where: { email },
      });

      if (emailExists)
        return reply.code(400).send({
          statusCode: 400,
          error: "Bad request",
          message: "Email already in use",
        });

      const hash = await hashPassword(password);

      const createdUser = await fastify.prisma.user.create({
        data: {
          email,
          password: hash,
        },
      });

      const emailConfirmationUrl = getConfirmationUrl(createdUser.id);

      await fastify.mailer.sendMail({
        to: email,
        from: config.MAIL_FROM,
        subject: "Email verification",
        html: registerMail(emailConfirmationUrl),
      });

      reply.status(201);
    },
  });

  fastify.post("/refresh-tokens", {
    handler: async (request, reply) => {
      const cookie = request.cookies.refreshToken;
      if (!cookie)
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "No refresh token provided",
        });

      const refreshToken = await verifyRefreshJwt(cookie);

      if (!refreshToken)
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid refresh token",
        });

      const user = await fastify.prisma.user.findUnique({
        where: { id: refreshToken.userId },
      });

      if (!user)
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid refresh token, user not found",
        });

      const dbRefreshToken = await fastify.prisma.refreshToken.delete({
        where: { id: refreshToken.jti },
      });

      if (!dbRefreshToken)
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid refresh token, token is revoked",
        });

      const newDbRefreshToken = await fastify.prisma.refreshToken.create({
        data: {},
      });

      return reply.send({
        statusCode: 200,
        message: "Old tokens have been revoked",
        accessToken: await encryptAccessJwt({
          userId: user.id,
          email: user.email,
          flags: user.flags,
        }),
        refreshToken: await encryptRefreshJwt({
          userId: user.id,
          email: user.email,
          flags: user.flags,
          jti: newDbRefreshToken.id,
        }),
      });
    },
  });
};

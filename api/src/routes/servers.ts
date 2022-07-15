import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { zodToJson } from "../utils/zodToJson";

const getServerSchema = {
  params: z.object({
    serverId: z.string(),
  }),
};

const putChannelSchema = {
  params: z.object({
    serverId: z.string(),
  }),
  body: z.object({
    channelId: z.string(),
    webhookId: z.string(),
    webhookToken: z.string(),
  }),
};

const deleteChannelSchema = {
  params: z.object({
    serverId: z.string(),
  }),
};

const putRoleSchema = {
  params: z.object({
    serverId: z.string(),
  }),
  body: z.object({
    roleId: z.string(),
  }),
};

const deleteRoleSchema = {
  params: z.object({
    serverId: z.string(),
  }),
};

const putThreadSchema = {
  params: z.object({
    serverId: z.string(),
  }),
  body: z.object({
    threadId: z.string(),
    channelId: z.string(),
    webhookId: z.string(),
    webhookToken: z.string(),
  }),
};

const deleteThreadSchema = {
  params: z.object({
    serverId: z.string(),
  }),
};

export const serverRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get<{
    Params: z.infer<typeof getServerSchema.params>;
  }>("/:serverId", {
    schema: {
      params: zodToJson(getServerSchema.params),
    },
    preHandler: auth(Flags.GetServers),
    handler: async (request, reply) => {
      const { serverId } = request.params;

      const server = await fastify.prisma.server.findUnique({
        where: { id: serverId },
      });

      if (!server) return reply.code(404).send({ error: "Server not found" });

      return reply.send(server);
    },
  });

  fastify.put<{
    Params: z.infer<typeof putChannelSchema.params>;
    Body: z.infer<typeof putChannelSchema.body>;
  }>("/:serverId/channel", {
    schema: {
      params: zodToJson(putChannelSchema.params),
      body: zodToJson(putChannelSchema.body),
    },
    preHandler: auth(Flags.EditServers),
    handler: async (request, reply) => {
      const { serverId } = request.params;
      const { channelId, webhookId, webhookToken } = request.body;

      const server = await fastify.prisma.server.upsert({
        where: { id: serverId },
        update: {
          channelId,
          webhookId,
          webhookToken,
        },
        create: {
          id: serverId,
          channelId,
          webhookId,
          webhookToken,
        },
      });

      return reply.send(server);
    },
  });

  fastify.delete<{
    Params: z.infer<typeof deleteChannelSchema.params>;
  }>("/:serverId/channel", {
    schema: {
      params: zodToJson(deleteChannelSchema.params),
    },
    preHandler: auth(Flags.EditServers),
    handler: async (request, reply) => {
      const { serverId } = request.params;

      await fastify.prisma.server.update({
        where: { id: serverId },
        data: {
          channelId: null,
          webhookId: null,
          webhookToken: null,
        },
      });

      return reply.status(204);
    },
  });

  fastify.put<{
    Params: z.infer<typeof putRoleSchema.params>;
    Body: z.infer<typeof putRoleSchema.body>;
  }>("/:serverId/role", {
    schema: {
      params: zodToJson(putRoleSchema.params),
      body: zodToJson(putRoleSchema.body),
    },
    preHandler: auth(Flags.EditServers),
    handler: async (request, reply) => {
      const { serverId } = request.params;
      const { roleId } = request.body;

      const server = await fastify.prisma.server.upsert({
        where: { id: serverId },
        update: {
          roleId,
        },
        create: {
          id: serverId,
          roleId,
        },
      });

      return reply.send(server);
    },
  });

  fastify.delete<{
    Params: z.infer<typeof deleteRoleSchema.params>;
  }>("/:serverId/role", {
    schema: {
      params: zodToJson(deleteRoleSchema.params),
    },
    preHandler: auth(Flags.EditServers),
    handler: async (request, reply) => {
      const { serverId } = request.params;

      await fastify.prisma.server.update({
        where: { id: serverId },
        data: {
          roleId: null,
        },
      });

      return reply.status(204);
    },
  });

  fastify.put<{
    Params: z.infer<typeof putThreadSchema.params>;
    Body: z.infer<typeof putThreadSchema.body>;
  }>("/:serverId/thread", {
    schema: {
      params: zodToJson(putThreadSchema.params),
      body: zodToJson(putThreadSchema.body),
    },
    preHandler: auth(Flags.EditServers),
    handler: async (request, reply) => {
      const { serverId } = request.params;

      const server = await fastify.prisma.server.upsert({
        where: { id: serverId },
        update: request.body,
        create: {
          id: serverId,
          ...request.body,
        },
      });

      return reply.send(server);
    },
  });

  fastify.delete<{
    Params: z.infer<typeof deleteThreadSchema.params>;
  }>("/:serverId/thread", {
    schema: {
      params: zodToJson(deleteThreadSchema.params),
    },
    preHandler: auth(Flags.EditServers),
    handler: async (request, reply) => {
      const { serverId } = request.params;

      await fastify.prisma.server.update({
        where: { id: serverId },
        data: {
          channelId: null,
          threadId: null,
          webhookId: null,
          webhookToken: null,
        },
      });

      return reply.status(204);
    },
  });

  fastify.get("/counts", {
    preHandler: auth(Flags.GetServers),
    handler: async (request, reply) => {
      const [total, sendable, hasOnlyChannel, hasWebhook, hasRole] =
        await fastify.prisma.$transaction([
          // total
          fastify.prisma.server.count(),
          // sendable
          fastify.prisma.server.count({
            where: {
              channelId: {
                not: null,
              },
            },
          }),
          // has only channel
          fastify.prisma.server.count({
            where: {
              channelId: {
                not: null,
              },
              webhookId: null,
              webhookToken: null,
            },
          }),
          // has webhook
          fastify.prisma.server.count({
            where: {
              NOT: {
                channelId: null,
                webhookId: null,
                webhookToken: null,
              },
            },
          }),
          // has role
          fastify.prisma.server.count({
            where: {
              roleId: {
                not: null,
              },
            },
          }),
        ]);

      return reply.send({
        total,
        sendable,
        hasOnlyChannel,
        hasWebhook,
        hasRole,
      });
    },
  });
};

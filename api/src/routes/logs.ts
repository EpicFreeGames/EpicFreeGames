import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { zodToJson } from "../utils/zodToJson";

const addCommandLogSchema = {
  body: z.object({
    command: z.string(),
    senderId: z.string(),
    serverId: z.string(),
  }),
};

const addSendingLogSchema = {
  body: z.object({
    serverId: z.string(),
    sendingId: z.string(),
    type: z.string(),
    result: z.string(),
  }),
};

export const logRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post<{
    Body: z.infer<typeof addCommandLogSchema.body>;
  }>("/commands", {
    schema: {
      body: zodToJson(addCommandLogSchema.body),
    },
    preHandler: auth(Flags.AddCommandLogs),
    handler: async (request, reply) => {
      const addedLog = await fastify.prisma.commandLog.create({
        data: request.body,
      });

      return reply.send(addedLog);
    },
  });

  fastify.post<{
    Body: z.infer<typeof addSendingLogSchema.body>;
  }>("/sends", {
    schema: {
      body: zodToJson(addSendingLogSchema.body),
    },
    preHandler: auth(Flags.AddSendingLogs),
    handler: async (request, reply) => {
      const addedLog = await fastify.prisma.sendingLog.create({
        data: request.body,
      });

      return reply.send(addedLog);
    },
  });
};

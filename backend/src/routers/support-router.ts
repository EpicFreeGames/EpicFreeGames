import { authProcedure, router } from "../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";

const serverFields = {
	discordId: true,
	channelId: true,
	channelUpdatedAt: true,
	webhookId: true,
	threadId: true,
	roleId: true,
	createdAt: true,
	languageCode: true,
	currencyCode: true,
	sendLogs: {
		select: {
			type: true,
			createdAt: true,
			result: true,
			success: true,
			statusCode: true,
			send: {
				select: {
					games: { select: { displayName: true } },
				},
			},
		},
	},
};

export const supportRouter = router({
	search: authProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const server = await ctx.db.discordServer.findFirst({
				where: { discordId: input.id },
				select: serverFields,
			});
			if (server) {
				return [server];
			}

			const logs = await ctx.db.discordCommandLog.findMany({
				where: { senderId: input.id },
				distinct: ["serverId"],
				select: { serverId: true },
				take: 100,
			});

			const serversByUserId = await ctx.db.discordServer.findMany({
				where: {
					discordId: { in: logs.map((l) => l.serverId!) },
				},
				select: serverFields,
			});

			return serversByUserId;
		}),

	commands: authProcedure
		.input(z.object({ discordServerId: z.string() }))
		.query(async ({ ctx, input }) => {
			const server = await ctx.db.discordServer.findFirst({
				where: { discordId: input.discordServerId },
			});
			if (!server) {
				throw new TRPCError({ code: "NOT_FOUND", message: "server not found" });
			}

			return await ctx.db.discordCommandLog.findMany({
				where: {
					serverId: input.discordServerId,
					OR: [{ command: { contains: "channel" } }, { command: { contains: "role" } }],
				},
				orderBy: {
					createdAt: "desc",
				},
				select: {
					createdAt: true,
					command: true,
					senderId: true,
				},
				take: 100,
			});
		}),
});

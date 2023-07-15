import z from "zod";
import { authProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sendWebhooks } from "../discord/sender/webhookSender";
import { sendMessages } from "../discord/sender/messageSender";
import { PrismaClient } from "@prisma/client";

export const sendRouter = router({
	getAll: authProcedure.query(async (props) => {
		const sends = await props.ctx.db.send.findMany({
			include: {
				_count: { select: { sendLogs: true } },
				games: { select: { id: true, name: true } },
			},
		});

		return sends;
	}),

	createSend: authProcedure
		.input(z.object({ gameIds: z.array(z.string()) }))
		.mutation(async (props) => {
			const games = await props.ctx.db.game.findMany({
				where: { id: { in: props.input.gameIds } },
			});

			if (games.length === 0) {
				throw new Error("No games found");
			}

			if (games.length !== props.input.gameIds.length) {
				throw new Error("Not all games found");
			}

			await props.ctx.db.send.create({
				data: {
					games: { connect: games.map((game) => ({ id: game.id })) },
				},
			});
		}),

	removeSend: authProcedure.input(z.object({ sendId: z.string() })).mutation(async (props) => {
		const send = await props.ctx.db.send.findUnique({
			where: { id: props.input.sendId },
		});

		if (!send) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Send not found",
			});
		}

		await props.ctx.db.send.delete({
			where: { id: props.input.sendId },
		});
	}),

	startSending: authProcedure.input(z.object({ sendId: z.string() })).mutation(async (props) => {
		const send = await getSendForSending(props.ctx.db, props.input.sendId);
		if (!send) {
			throw new Error("Send not found");
		}

		sendWebhooks(props.ctx.db, send);
		sendMessages(props.ctx.db, send);
	}),
});

function getSendForSending(db: PrismaClient, sendId: string) {
	return db.send.findUnique({
		where: { id: sendId },
		include: { games: { include: { prices: true } } },
	});
}

export type SendForSending = NonNullable<Awaited<ReturnType<typeof getSendForSending>>>;

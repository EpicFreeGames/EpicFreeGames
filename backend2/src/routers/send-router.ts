import z from "zod";
import { authProcedure, router } from "../trpc";
// import { sendMessages, sendWebhooks } from "../discord/sender";

export const sendRouter = router({
	getAll: authProcedure.query(async (props) => {
		const sends = await props.ctx.db.send.findMany({
			include: { games: { select: { id: true, name: true } } },
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

	startSending: authProcedure.input(z.object({ sendId: z.string() })).mutation(async (props) => {
		const send = await props.ctx.db.send.findUnique({
			where: { id: props.input.sendId },
		});

		if (!send) {
			throw new Error("Send not found");
		}

		// sendWebhooks(props.ctx.db, send.id);
		// sendMessages(props.ctx.db, send.id);
	}),
});

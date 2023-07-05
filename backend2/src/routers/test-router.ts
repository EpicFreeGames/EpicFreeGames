import { game } from "@prisma/client";
import { authProcedure, router } from "../trpc";
import { sendWebhooks } from "../discord/sender";

export const testRouter = router({
	send: authProcedure.mutation(async (props) => {
		const game: game = {
			id: "1",
			confirmed: false,
			display_name: "test",
			start_date: new Date(),
			end_date: new Date(),
			image_url: "test",
			name: "test",
			path: "test",
			store_id: "test",
		};

		await props.ctx.db.game.upsert({
			where: { id: game.id },
			update: game,
			create: game,
		});

		const newSend = await props.ctx.db.send.create({
			data: {
				games: { connect: { id: game.id } },
			},
		});

		await sendWebhooks(props.ctx.db, newSend.id);
	}),
});

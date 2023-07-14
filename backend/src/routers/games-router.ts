import z from "zod";
import { authProcedure, router } from "../trpc";

export const gamesRouter = router({
	getAll: authProcedure.query((props) => {
		return props.ctx.db.game.findMany({
			include: { prices: true },
			orderBy: { start_date: "desc" },
		});
	}),
	toggleConfirmed: authProcedure
		.input(
			z.object({
				gameId: z.string(),
				confirmed: z.boolean(),
			})
		)
		.mutation(async (props) => {
			await props.ctx.db.game.update({
				where: { id: props.input.gameId },
				data: { confirmed: props.input.confirmed },
			});
		}),

	create: authProcedure
		.input(
			z.object({
				name: z.string(),
				display_name: z.string(),
				image_url: z.string(),
				start_date: z.date(),
				end_date: z.date(),
				path: z.string(),

				usd_price_formatted: z.string(),
				usd_price_value: z.number(),
			})
		)
		.mutation(async (props) => {
			await props.ctx.db.game.create({
				data: {
					name: props.input.name,
					display_name: props.input.display_name,
					image_url: props.input.image_url,
					start_date: props.input.start_date,
					end_date: props.input.end_date,
					path: props.input.path,

					confirmed: false,
					store_id: "epic_games",

					prices: {
						create: {
							currency_code: "USD",
							formatted_value: props.input.usd_price_formatted,
							value: props.input.usd_price_value,
						},
					},
				},
			});
		}),

	edit: authProcedure
		.input(
			z.object({
				gameId: z.string(),

				name: z.string(),
				display_name: z.string(),
				image_url: z.string(),
				start_date: z.date(),
				end_date: z.date(),
				path: z.string(),

				usd_price_formatted: z.string(),
				usd_price_value: z.number(),
			})
		)
		.mutation(async (props) => {
			const usdPrice = await props.ctx.db.game_price.findFirst({
				where: { game_id: props.input.gameId, currency_code: "USD" },
			});

			await props.ctx.db.game.update({
				where: { id: props.input.gameId },
				data: {
					name: props.input.name,
					display_name: props.input.display_name,
					image_url: props.input.image_url,
					start_date: props.input.start_date,
					end_date: props.input.end_date,
					path: props.input.path,

					prices: {
						...(usdPrice
							? {
									update: {
										where: { id: usdPrice.id },
										data: {
											formatted_value: props.input.usd_price_formatted,
											value: props.input.usd_price_value,
										},
									},
							  }
							: {
									create: {
										currency_code: "USD",
										formatted_value: props.input.usd_price_formatted,
										value: props.input.usd_price_value,
									},
							  }),
					},
				},
			});
		}),
});

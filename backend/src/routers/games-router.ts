import z from "zod";
import { authProcedure, router } from "../trpc";

export const gamesRouter = router({
	getAll: authProcedure.query((props) => {
		return props.ctx.db.game.findMany({
			include: { prices: true },
			orderBy: { startDate: "desc" },
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
				displayName: z.string(),
				imageUrl: z.string(),
				startDate: z.date(),
				endDate: z.date(),
				path: z.string(),

				usd_price_formatted: z.string(),
				usd_price_value: z.number(),
			})
		)
		.mutation(async (props) => {
			await props.ctx.db.game.create({
				data: {
					name: props.input.name,
					displayName: props.input.displayName,
					imageUrl: props.input.imageUrl,
					startDate: props.input.startDate,
					endDate: props.input.endDate,
					path: props.input.path,

					confirmed: false,
					storeId: "epic_games",

					prices: {
						create: {
							currencyCode: "USD",
							formattedValue: props.input.usd_price_formatted,
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
				displayName: z.string(),
				imageUrl: z.string(),
				startDate: z.date(),
				endDate: z.date(),
				path: z.string(),

				usd_price_formatted: z.string(),
				usd_price_value: z.number(),
			})
		)
		.mutation(async (props) => {
			const usdPrice = await props.ctx.db.gamePrice.findFirst({
				where: { gameId: props.input.gameId, currencyCode: "USD" },
			});

			await props.ctx.db.game.update({
				where: { id: props.input.gameId },
				data: {
					name: props.input.name,
					displayName: props.input.displayName,
					imageUrl: props.input.imageUrl,
					startDate: props.input.startDate,
					endDate: props.input.endDate,
					path: props.input.path,

					prices: {
						...(usdPrice
							? {
									update: {
										where: { id: usdPrice.id },
										data: {
											formattedValue: props.input.usd_price_formatted,
											value: props.input.usd_price_value,
										},
									},
							  }
							: {
									create: {
										currencyCode: "USD",
										formattedValue: props.input.usd_price_formatted,
										value: props.input.usd_price_value,
									},
							  }),
					},
				},
			});
		}),
});

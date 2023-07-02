import { publicProcedure, router } from "../trpc";

export const gamesRouter = router({
	getAll: publicProcedure.query(() => {
		console.log("getAll");

		return [
			{
				id: 1,
				name: "Game 1",
			},
			{
				id: 2,
				name: "Game 2",
			},
		];
	}),
});

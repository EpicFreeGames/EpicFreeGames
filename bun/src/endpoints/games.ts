import { get } from "../router/handler";
import { router } from "../router/router";
import { createResponse } from "../utils";

export const gamesRouter = router(
	"/games",
	get("/", {
		handle: (req) => {
			return createResponse(200, [
				{
					id: 1,
					name: "Game 1",
				},
			]);
		},
	})
);

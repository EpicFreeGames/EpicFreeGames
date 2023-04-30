import { z } from "zod";
import { get } from "../router/handler";
import { router } from "../router/router";
import { createResponse } from "../utils";

export const gamesRouter = router(
	"/games",
	get("/:id", {
		validation: { path: z.object({ id: z.string() }) },
		handle: (req) => {
			console.log(req.pathParams.id);
			console.log(req.queryParams.id);
			console.log(req.pathParams.id);

			return createResponse(200, [
				{
					id: 1,
					name: "Game 1",
				},
			]);
		},
	})
);

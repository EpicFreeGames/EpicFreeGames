import { z } from "zod";
import { Router } from "../router/router";
import { createResponse } from "../utils";

export const gamesRouter = new Router()
	.get("/:id", async () => {
		return createResponse(200, [
			{
				id: 1,
				name: "game 1",
			},
		]);
	})
	.getWithValidation(
		"/test",
		{
			pathParams: z.object({
				test: z.string(),
			}),
		},
		async (req) => {
			req.pathParams.test;
		}
	);

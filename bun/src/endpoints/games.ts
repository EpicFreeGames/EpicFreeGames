import { z } from "zod";
import { Router } from "../router2.0/router";
import { createResponse } from "../utils";

export const gamesRouter = new Router().get("/:id", async () => {
	return createResponse(200, [
		{
			id: 1,
			name: "game 1",
		},
	]);
});

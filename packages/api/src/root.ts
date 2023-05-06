import { userEndpoints } from "./endpoints/users";
import { router } from "./trpc";

export const apiRouter = router({
	users: userEndpoints,
});

export type ApiRouter = typeof apiRouter;

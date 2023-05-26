import type { Command } from "../commandHandler";

export const freeCommand = {
	requiresGuild: false,
	handler: async (ctx, i, language, currency) => {
		ctx.logger.info("freeCommand");
	},
} satisfies Command;

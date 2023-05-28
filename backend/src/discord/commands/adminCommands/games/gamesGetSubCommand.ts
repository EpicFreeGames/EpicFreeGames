import { Ctx } from "../../../../ctx";
import { chunks } from "../../../../utils";
import { followUpToInteraction, respondToInteraction } from "../../../discordUtils";
import { APIInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export async function gamesGetSubCommand(ctx: Ctx, i: APIInteraction) {
	await respondToInteraction(i, {
		type: InteractionResponseType.DeferredChannelMessageWithSource,
		data: { flags: MessageFlags.Ephemeral },
	});

	const games = await ctx.db.games.find().toArray();

	const rows = games.map(
		(game) => `${game.confirmed ? "✅" : "❌"} - ${game._id} - ${game.name}`
	);

	const chunksOfRows = chunks(rows, 2);

	for (const chunkOfRows of chunksOfRows) {
		await followUpToInteraction(i, {
			content: chunkOfRows.join("\n"),
			flags: MessageFlags.Ephemeral,
		});
	}
}

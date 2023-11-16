import { embedUtils } from "./_utils";

export function debugEmbed(guildId: string) {
	return {
		color: embedUtils.colors.gray,
		title: "Debug",
		description: `${embedUtils.bold("Guild ID:")} ${guildId}`,
	};
}

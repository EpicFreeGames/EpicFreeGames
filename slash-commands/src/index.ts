import { globalCommands, guildCommands } from "./commands";
import { env } from "./env";

console.log("Updating slash commands...");

await Promise.all([
	fetch(`https://discord.com/api/v10/applications/${env.DC_CLIENT_ID}/commands`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${env.DC_TOKEN}`,
		},
		body: JSON.stringify(globalCommands),
	}).then(() => console.log("Global commands updated!")),
	fetch(
		`https://discord.com/api/v10/applications/${env.DC_CLIENT_ID}/guilds/${env.DC_GUILD_ID}/commands`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${env.DC_TOKEN}`,
			},
			body: JSON.stringify(guildCommands),
		}
	).then(() => console.log("Guild commands updated!")),
]);

console.log("Done!");

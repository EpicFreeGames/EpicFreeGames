import {
	APIChatInputApplicationCommandDMInteraction,
	APIChatInputApplicationCommandGuildInteraction,
	APIChatInputApplicationCommandInteraction,
} from "discord-api-types/v10";
import { DiscordRequestContext } from "../context";
import { Language } from "../i18n/language";
import { Currency } from "../i18n/currency";
import { discord_server } from "@prisma/client";

export type Command =
	| {
			name: string;
			needsGuild: true;
			needsManageGuild: boolean;
			handle: (props: {
				ctx: DiscordRequestContext;
				i: APIChatInputApplicationCommandGuildInteraction;
				language: Language;
				currency: Currency;
				dbServer: discord_server;
			}) => Promise<any> | any;
	  }
	| {
			name: string;
			needsGuild: false;
			needsManageGuild: boolean;
			handle: (props: {
				ctx: DiscordRequestContext;
				i:
					| APIChatInputApplicationCommandDMInteraction
					| APIChatInputApplicationCommandInteraction;
				language: Language;
				currency: Currency;
				dbServer?: discord_server;
			}) => Promise<any> | any;
	  };

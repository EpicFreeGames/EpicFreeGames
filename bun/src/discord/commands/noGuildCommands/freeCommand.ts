import { APIDMInteraction, APIGuildInteraction } from "discord-api-types/v10";

import { Currency } from "@/discord/i18n/currency";
import { Language } from "@/discord/i18n/language";

export const freeCommand = (
	interaction: APIDMInteraction | APIGuildInteraction,
	language: Language,
	currency: Currency
) => {};

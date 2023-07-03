import { discord_server } from "@prisma/client";
import { Currency, currencies } from "../i18n/currency";
import { Language, languages } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";

export function settingsEmbed(
	server: discord_server | null,
	language: Language,
	currency: Currency
) {
	const embedLanguage = server?.language_code
		? languages.get(server?.language_code) ?? language
		: language;
	const embedCurrency = server?.currency_code
		? currencies.get(server?.currency_code) ?? currency
		: currency;

	return {
		title: t(embedLanguage, "settings"),
		color: embedUtils.colors.gray,
		description:
			embedUtils.bold(`${t(embedLanguage, "channel")}/${t(embedLanguage, "thread")}:\n`) +
			showChannelOrThread(server, embedLanguage) +
			"\n\n" +
			embedUtils.bold(`${t(embedLanguage, "role")}:\n`) +
			showRole(server, embedLanguage) +
			"\n\n" +
			embedUtils.bold(`${t(embedLanguage, "language")}:\n`) +
			embedLanguage.name +
			"\n\n" +
			embedUtils.bold(`${t(embedLanguage, "currency")}:\n`) +
			embedCurrency.name +
			embedUtils.footer(embedLanguage),
	};
}

function showChannelOrThread(server: discord_server | null, language: Language) {
	if (server?.thread_id) {
		return `<#${server?.thread_id}>`;
	} else if (server?.channel_id) {
		return `<#${server?.channel_id}>`;
	} else {
		return t(language, "channel_thread_not_set");
	}
}

function showRole(server: discord_server | null, language: Language) {
	if (server?.role_id) {
		if (server.role_id === "1") return "@everyone";

		return `<@&${server?.role_id}>`;
	} else {
		return t(language, "role_not_set");
	}
}

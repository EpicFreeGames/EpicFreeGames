import { Currency, currencies } from "../i18n/currency";
import { Language, languages } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";
import { DbDiscordServer } from "../../db/dbTypes";

export function settingsEmbed(
	server: DbDiscordServer | null,
	language: Language,
	currency: Currency
) {
	const embedLanguage = server?.languageCode
		? languages.get(server?.languageCode) ?? language
		: language;
	const embedCurrency = server?.currencyCode
		? currencies.get(server?.currencyCode) ?? currency
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

export function updatedSettingsEmbed(language: Language) {
	return {
		title: "✅",
		color: embedUtils.colors.green,
		description: embedUtils.bold(t(language, "updated_settings")),
	};
}

export function currentSettingsEmbed(language: Language) {
	return {
		title: "✅",
		color: embedUtils.colors.green,
		description: embedUtils.bold(t(language, "current_settings")),
	};
}

function showChannelOrThread(server: DbDiscordServer | null, language: Language) {
	if (server?.threadId) {
		return `<#${server?.threadId}>`;
	} else if (server?.channelId) {
		return `<#${server?.channelId}>`;
	} else {
		return t(language, "channel_thread_not_set");
	}
}

function showRole(server: DbDiscordServer | null, language: Language) {
	if (server?.roleId) {
		if (server.roleId === "1") return "@everyone";

		return `<@&${server?.roleId}>`;
	} else {
		return t(language, "role_not_set");
	}
}

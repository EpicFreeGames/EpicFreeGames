import { Translations, useT } from "@/i18n";

export const generateStaticParams = async () => {
	const locales = ["en", "de"];
	const translations = { test: "test-ttt", test2: "test3-ttt" };

	return locales.map((locale) => ({
		locale,
		translations,
	}));
};

export default function Page({
	params,
}: {
	params: { locale: string; translations: Translations };
}) {
	const t = useT(params.translations);

	return (
		<div>
			test {params.locale} {t("test")}
		</div>
	);
}

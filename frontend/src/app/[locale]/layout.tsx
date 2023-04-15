import { type Locale, getT, i18n } from "@/i18n/i18n";

import "./globals.css";

export const generateStaticParams = async () => {
	return i18n.locales.map((locale) => ({
		locale,
	}));
};

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: Locale };
}) {
	const t = await getT(params.locale);

	return (
		<html lang={params.locale}>
			<body>
				<div>
					test {params.locale} {t("links")}
				</div>
				{children}
			</body>
		</html>
	);
}

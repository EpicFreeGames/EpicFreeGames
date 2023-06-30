import { webLanguages } from "./i18n/languages";

export function objToStr(obj: any) {
	return JSON.stringify(obj, null, 4);
}

const supportedLangCodes = webLanguages.map((lang) => lang.code);

export function resolvePathname(pathname: string) {
	const splitPathname = pathname.split("/").filter((x) => x !== "");
	const firstPart = splitPathname[0];

	if (!firstPart) {
		return {
			lang: "en",
			pathname: "/",
		};
	}

	if (supportedLangCodes.includes(firstPart)) {
		return {
			lang: firstPart,
			pathname: "/" + splitPathname.slice(1).join("/"),
		};
	}

	return {
		lang: "en",
		pathname: "/" + splitPathname.join("/"),
	};
}

export function resolveHref(props: { href: string; currentPath: string; withLang?: boolean }) {
	const { href, currentPath, withLang = true } = props;

	const { lang, pathname } = resolvePathname(props.currentPath);

	const innerWithLang = withLang && lang !== "en";

	console.log({
		currentPath,
		href,
		lang,
		pathname,
		withLang,
		innerWithLang,
	});

	let toReturn = null;

	if (href.includes(":") || href.includes("http")) {
		return href;
	}

	if (href.startsWith("/")) {
		if (innerWithLang) {
			toReturn = `/${lang}${href}`;
		} else {
			toReturn = href;
		}
	} else {
		if (innerWithLang) {
			toReturn = `/${lang}/${pathname.replaceAll("/", "")}/${href}`;
		} else {
			toReturn = `/${pathname.replaceAll("/", "")}/${href}`;
		}
	}

	return toReturn.length === 1
		? toReturn
		: toReturn.match(/\/$/)
		? toReturn.slice(0, -1)
		: toReturn;
}

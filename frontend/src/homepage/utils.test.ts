import { resolveHref, resolvePathname } from "./utils";

describe("resolvePathname", () => {
	it("returns the correct object for /en/", () => {
		const result = resolvePathname("/en/");
		expect(result).toEqual({ lang: "en", pathname: "/" });
	});

	it("returns the correct object for /en/abc", () => {
		const result = resolvePathname("/en/abc");
		expect(result).toEqual({ lang: "en", pathname: "/abc" });
	});

	it("returns the correct object for /", () => {
		const result = resolvePathname("/");
		expect(result).toEqual({ lang: "en", pathname: "/" });
	});

	it("returns the correct object for /abc", () => {
		const result = resolvePathname("/abc");
		expect(result).toEqual({ lang: "en", pathname: "/abc" });
	});

	it("returns the correct object for /es-ES/", () => {
		const result = resolvePathname("/es-ES/");
		expect(result).toEqual({ lang: "es-ES", pathname: "/" });
	});

	it("returns the correct object for /es-ES/abc", () => {
		const result = resolvePathname("/es-ES/abc");
		expect(result).toEqual({ lang: "es-ES", pathname: "/abc" });
	});

	it("returns the correct object for an empty string", () => {
		const result = resolvePathname("");
		expect(result).toEqual({ lang: "en", pathname: "/" });
	});

	it("returns the correct object for a string with only a language code", () => {
		const result = resolvePathname("/es-ES");
		expect(result).toEqual({ lang: "es-ES", pathname: "/" });
	});

	it("returns the correct object for a string with multiple language codes", () => {
		const result = resolvePathname("/es-ES/en/abc");
		expect(result).toEqual({ lang: "es-ES", pathname: "/en/abc" });
	});

	it("returns the correct object for a string with a language code and no pathname", () => {
		const result = resolvePathname("/es-ES/");
		expect(result).toEqual({ lang: "es-ES", pathname: "/" });
	});

	it("returns the correct object for a string with a pathname that starts with a language code", () => {
		const result = resolvePathname("/es-ES/es-ES/abc");
		expect(result).toEqual({ lang: "es-ES", pathname: "/es-ES/abc" });
	});
});

describe("resolveHref", () => {
	it("handles root with currentPath = langRoot, lang not en and withLang = true", () => {
		const result = resolveHref({
			currentPath: "/es-ES",
			href: "/",
			withLang: true,
		});

		expect(result).toEqual("/es-ES");
	});

	it("handles root with currentPath = langRoot, lang not en and withLang = false", () => {
		const result = resolveHref({
			currentPath: "/es-ES",
			href: "/",
			withLang: false,
		});

		expect(result).toEqual("/");
	});

	it("handles going to root with currentPath not root, lang not en, with withLang = true", () => {
		const result = resolveHref({
			currentPath: "/es-ES/abc",
			href: "/",
			withLang: true,
		});

		expect(result).toEqual("/es-ES");
	});

	it("handles going to root with currentPath not root, lang not en, with withLang = false", () => {
		const result = resolveHref({
			currentPath: "/es-ES/abc",
			href: "/",
			withLang: false,
		});

		expect(result).toEqual("/");
	});

	it("handles going to absolute with currentPath not root, lang not en, withLang = true", () => {
		const result = resolveHref({
			currentPath: "/es-ES/abc",
			href: "/def",
			withLang: true,
		});

		expect(result).toEqual("/es-ES/def");
	});

	it("handles going to absolute with currentPath not root, lang not en, withLang = false", () => {
		const result = resolveHref({
			currentPath: "/es-ES/abc",
			href: "/def",
			withLang: false,
		});

		expect(result).toEqual("/def");
	});

	it("handles going to absolute with currentPath not root, lang en, withLang = false", () => {
		const result = resolveHref({
			currentPath: "/abc",
			href: "/def",
			withLang: true,
		});

		expect(result).toEqual("/def");
	});

	it("handles going to absolute with currentPath root, lang en, withLang = false", () => {
		const result = resolveHref({
			currentPath: "/",
			href: "/def",
			withLang: true,
		});

		expect(result).toEqual("/def");
	});

	it("handles going to relative with currentPath root, lang en, withLang = false", () => {
		const result = resolveHref({
			currentPath: "/",
			href: "/def",
			withLang: true,
		});

		expect(result).toEqual("/def");
	});

	it("handles going to relative with currentPath not root, lang en, withLang = false", () => {
		const result = resolveHref({
			currentPath: "/abc",
			href: "def",
			withLang: true,
		});

		expect(result).toEqual("/abc/def");
	});

	it("handles going to relative with currentPath not root, lang not en, withLang = false", () => {
		const result = resolveHref({
			currentPath: "/es-ES/abc",
			href: "def",
			withLang: true,
		});

		expect(result).toEqual("/es-ES/abc/def");
	});

	it("handles mailto", () => {
		const result = resolveHref({
			currentPath: "/es-ES/abc",
			href: "mailto:asdf@asdf.asdf",
		});

		expect(result).toEqual("mailto:asdf@asdf.asdf");
	});

	it("handles links to other websites", () => {
		const result = resolveHref({
			currentPath: "/es-ES/abc",
			href: "https://google.com",
		});

		expect(result).toEqual("https://google.com");
	});
});

/** @type {import("prettier").Config} */
module.exports = {
	printWidth: 100,
	tabWidth: 4,
	trailingComma: "es5",
	singleQuote: false,
	semi: true,
	useTabs: true,

	plugins: [require("./prettier.plugins.cjs")],

	importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
};

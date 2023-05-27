import sortImportsPlugin from "@trivago/prettier-plugin-sort-imports";

export default {
	parsers: {
		typescript: {
			...sortImportsPlugin.parsers.typescript.preprocess,
		},
	},
	options: {
		...sortImportsPlugin.options,
	},
};

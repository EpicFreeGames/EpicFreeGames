module.exports = {
  printWidth: 100,
  tabWidth: 2,
  trailingComma: "es5",
  singleQuote: false,
  semi: true,
  useTabs: false,

  plugins: [require("./prettier.plugins")],

  importOrder: ["<THIRD_PARTY_MODULES>", "^~(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

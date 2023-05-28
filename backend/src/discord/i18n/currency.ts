export type Currency = {
	code: string;
	name: string;
	before: string;
	after: string;
};

export const defaultCurrency: Currency = {
	code: "USD",
	name: "$ Dollar (USD)",
	after: "",
	before: "$",
};

export const currencies: Map<string, Currency> = new Map<string, Currency>([
	["USD", defaultCurrency],
	[
		"EUR",
		{
			name: "€ Euro (EUR)",
			code: "EUR",
			after: " €",
			before: "",
		},
	],
	[
		"CAD",
		{
			name: "$ Canadian Dollar (CAD)",
			code: "CAD",
			after: "",
			before: "CA$",
		},
	],
	[
		"INR",
		{
			name: "₹ Indian Rupee (INR)",
			code: "INR",
			after: "",
			before: "₹",
		},
	],
	[
		"GBP",
		{
			name: "£ British Pound (GBP)",
			code: "GBP",
			after: "",
			before: "£",
		},
	],
	[
		"UAH",
		{
			name: "₴ Ukrainian Hryvnia (UAH)",
			code: "UAH",
			after: "",
			before: "₴",
		},
	],
	[
		"RUB",
		{
			name: "₽ Russian Ruble (RUB)",
			code: "RUB",
			after: "",
			before: "₽",
		},
	],
	[
		"BYN",
		{
			name: "Br Belarusian Ruble (BYN)",
			code: "BYN",
			after: "",
			before: "Br",
		},
	],
	[
		"IDR",
		{
			name: "Rp Indonesian Rupiah (IDR)",
			code: "IDR",
			after: "",
			before: "Rp",
		},
	],
	[
		"NZD",
		{
			name: "$ New Zealand Dollar (NZD)",
			code: "NZD",
			after: "",
			before: "NZ$",
		},
	],
	[
		"VND",
		{
			name: "₫ Vietnamese Dong (VND)",
			code: "VND",
			after: " ₫",
			before: "",
		},
	],
	[
		"BRL",
		{
			name: "R$ Brazilian Real (BRL)",
			code: "BRL",
			after: "",
			before: "R$",
		},
	],
	[
		"SGD",
		{
			name: "S$ Singapore dollar (SGD)",
			code: "SGD",
			after: "",
			before: "S$",
		},
	],
	[
		"PHP",
		{
			name: "₱ Philippine peso (PHP)",
			code: "PHP",
			after: "",
			before: "₱",
		},
	],
	[
		"AUD",
		{
			name: "A$ Australian dollar (AUD)",
			code: "AUD",
			after: "",
			before: "A$",
		},
	],
	[
		"MXN",
		{
			name: "Mex$ Mexican Peso (MXN)",
			code: "MXN",
			after: "",
			before: "Mex$",
		},
	],
	[
		"TRY",
		{
			name: "₺ Türk lirası (TRY)",
			code: "TRY",
			after: "",
			before: "₺",
		},
	],
	[
		"TWD",
		{
			name: "NT$ New Taiwan dollar (TWD)",
			code: "TWD",
			after: "",
			before: "NT$",
		},
	],
	[
		"HUF",
		{
			name: "Ft Hungarian Forint (HUF)",
			code: "HUF",
			after: " Ft",
			before: "",
		},
	],
	[
		"PLN",
		{
			name: "zł Polish Zloty (PLN)",
			code: "PLN",
			after: " zł",
			before: "",
		},
	],
	[
		"COP",
		{
			name: "Col$ Colombian Peso (COP)",
			code: "COP",
			after: "",
			before: "Col$",
		},
	],
	[
		"MYR",
		{
			name: "RM Malaysian Ringgit (MYR)",
			code: "MYR",
			after: "",
			before: "RM",
		},
	],
	[
		"CLP",
		{
			name: "CLP$ Chilean Peso (CLP)",
			code: "CLP",
			after: "",
			before: "CLP$",
		},
	],
]);

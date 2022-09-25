import { ICurrency } from "@efg/types";

/**
 * Map<CurrencyCode, Currency>
 *
 * @example
 * {
 *   "USD": {
 *     "name": "$ Dollar (USD)",
 *     ...
 *   },
 * }
 */
export const currencies: Map<string, ICurrency> = new Map<string, ICurrency>([
  [
    "USD",
    {
      name: "$ Dollar (USD)",
      code: "USD",
      afterPrice: "",
      inFrontOfPrice: "$",
      apiValue: "US",
    },
  ],
  [
    "EUR",
    {
      name: "€ Euro (EUR)",
      code: "EUR",
      afterPrice: " €",
      inFrontOfPrice: "",
      apiValue: "DE",
    },
  ],
  [
    "CAD",
    {
      name: "$ Canadian Dollar (CAD)",
      code: "CAD",
      afterPrice: "",
      inFrontOfPrice: "CA$",
      apiValue: "CA",
    },
  ],
  [
    "INR",
    {
      name: "₹ Indian Rupee (INR)",
      code: "INR",
      afterPrice: "",
      inFrontOfPrice: "₹",
      apiValue: "IN",
    },
  ],
  [
    "GBP",
    {
      name: "£ British Pound (GBP)",
      code: "GBP",
      afterPrice: "",
      inFrontOfPrice: "£",
      apiValue: "GB",
    },
  ],
  [
    "UAH",
    {
      name: "₴ Ukrainian Hryvnia (UAH)",
      code: "UAH",
      afterPrice: "",
      inFrontOfPrice: "₴",
      apiValue: "UA",
    },
  ],
  [
    "RUB",
    {
      name: "₽ Russian Ruble (RUB)",
      code: "RUB",
      afterPrice: "",
      inFrontOfPrice: "₽",
      apiValue: "RU",
    },
  ],
  [
    "BYN",
    {
      name: "Br Belarusian Ruble (BYN)",
      code: "BYN",
      afterPrice: "",
      inFrontOfPrice: "Br",
      apiValue: "BY",
    },
  ],
  [
    "IDR",
    {
      name: "Rp Indonesian Rupiah (IDR)",
      code: "IDR",
      afterPrice: "",
      inFrontOfPrice: "Rp",
      apiValue: "ID",
    },
  ],
  [
    "NZD",
    {
      name: "$ New Zealand Dollar (NZD)",
      code: "NZD",
      afterPrice: "",
      inFrontOfPrice: "NZ$",
      apiValue: "NZ",
    },
  ],
  [
    "VND",
    {
      name: "₫ Vietnamese Dong (VND)",
      code: "VND",
      afterPrice: " ₫",
      inFrontOfPrice: "",
      apiValue: "VN",
    },
  ],
  [
    "BRL",
    {
      name: "R$ Brazilian Real (BRL)",
      code: "BRL",
      afterPrice: "",
      inFrontOfPrice: "R$",
      apiValue: "BR",
    },
  ],
  [
    "SGD",
    {
      name: "S$ Singapore dollar (SGD)",
      code: "SGD",
      afterPrice: "",
      inFrontOfPrice: "S$",
      apiValue: "SG",
    },
  ],
  [
    "PHP",
    {
      name: "₱ Philippine peso (PHP)",
      code: "PHP",
      afterPrice: "",
      inFrontOfPrice: "₱",
      apiValue: "PH",
    },
  ],
  [
    "AUD",
    {
      name: "A$ Australian dollar (AUD)",
      code: "AUD",
      afterPrice: "",
      inFrontOfPrice: "A$",
      apiValue: "AU",
    },
  ],
  [
    "MXN",
    {
      name: "Mex$ Mexican Peso (MXN)",
      code: "MXN",
      afterPrice: "",
      inFrontOfPrice: "Mex$",
      apiValue: "MX",
    },
  ],
  [
    "TRY",
    {
      name: "₺ Türk lirası (TRY)",
      code: "TRY",
      afterPrice: "",
      inFrontOfPrice: "₺",
      apiValue: "TR",
    },
  ],
  [
    "TWD",
    {
      name: "NT$ New Taiwan dollar (TWD)",
      code: "TWD",
      afterPrice: "",
      inFrontOfPrice: "NT$",
      apiValue: "TW",
    },
  ],
  [
    "HUF",
    {
      name: "Ft Hungarian Forint (HUF)",
      code: "HUF",
      afterPrice: " Ft",
      inFrontOfPrice: "",
      apiValue: "HU",
    },
  ],
]);

export const defaultCurrency = currencies.get("USD")!;

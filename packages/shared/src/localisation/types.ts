export enum Languages {
  en = "en",
  de = "de",
  fr = "fr",
  es = "es",
  ru = "ru",
  ua = "ua",
  pl = "pl",
  tr = "tr",
  cz = "cz",
  ro = "ro",
  jp = "jp",
  hi = "hi",
  pt = "pt",
  du = "du",
  fa = "fa",
  hu = "hu",
  id = "id",
  ge = "ge",
  vn = "vn",
  ar = "ar",
  it = "it",
  ko = "ko",
  bg = "bg",
}

export enum Currencies {
  USD = "USD",
  CAD = "CAD",
  EUR = "EUR",
  INR = "INR",
}

export const CurrencyData: ICurrencyData = {
  USD: {
    apiValue: "US",
    inFrontOfPrice: "$",
    afterPrice: "",
    name: "$ Dollar (USD)",
  },
  CAD: {
    apiValue: "CA",
    inFrontOfPrice: "CA$",
    afterPrice: "",
    name: "$ Canadian dollar (CAD)",
  },
  EUR: {
    apiValue: "DE",
    inFrontOfPrice: "",
    afterPrice: " €",
    name: "€ Euro (EUR)",
  },
  INR: {
    apiValue: "IN",
    inFrontOfPrice: "₹",
    afterPrice: "",
    name: "₹ Indian Rupee (INR)",
  },
};

type ICurrencyData = {
  [key in Currencies]: {
    apiValue: string;
    inFrontOfPrice: string;
    afterPrice: string;
    name: string;
  };
};

export const LanguagesWithFlags = {
  en: "English 🇬🇧",
  de: "Deutsch 🇩🇪",
  fr: "Français 🇫🇷",
  es: "Español 🇪🇸",
  ru: "Pусский 🇷🇺",
  ua: "Український 🇺🇦",
  pl: "Polski 🇵🇱",
  tr: "Türkçe 🇹🇷",
  cz: "čeština 🇨🇿",
  ro: "Română 🇷🇴",
  jp: "日本語 🇯🇵",
  hi: "हिंदी 🇮🇳",
  pt: "Português 🇵🇹",
  du: "Nederlands 🇳🇱",
  fa: "فارسی 🇮🇷",
  hu: "Magyar 🇭🇺",
  id: "Indonesian 🇮🇩",
  ge: "ქართული 🇬🇪",
  vn: "Tiếng Việt 🇻🇳",
  ar: "عربي 🇸🇦",
  it: "Italiano 🇮🇹",
  ko: "한국어 🇰🇷",
  bg: "български 🇧🇬",
};

export type PathKeys<T> = T extends string
  ? []
  : {
      [K in keyof T]: [K, ...PathKeys<T[K]>];
    }[keyof T];

export type Join<T extends string[], Delimiter extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer Other]
  ? F extends string
    ? `${F}${Delimiter}${Join<Extract<Other, string[]>, Delimiter>}`
    : never
  : string;

type Trim<A extends string> = A extends ` ${infer B}`
  ? Trim<B>
  : A extends `${infer C} `
  ? Trim<C>
  : A;

type SearchForVariable<A extends string> = A extends `${infer A}{${infer B}}${infer C}`
  ? SearchForVariable<A> | Trim<B> | SearchForVariable<C>
  : never;

export type Variables<
  T extends string | object,
  Path extends string,
  Delimiter extends string
> = Path extends `${infer A}${Delimiter}${infer O}`
  ? A extends keyof T
    ? Variables<Extract<T[A], string | object>, O, Delimiter>
    : never
  : Path extends `${infer A}`
  ? A extends keyof T
    ? SearchForVariable<Extract<T[A], string>>
    : never
  : never;

export type ITranslation = {
  [key in Languages]: string;
};

import { translations } from "./translations";
import {
  ILanguage,
  Join,
  Links,
  PathKeys,
  Variables,
  linkEnd,
  linkStart,
  translationsType,
  variableEnd,
  variableStart,
} from "./types";

type T = translationsType;

type BaseArgs<P extends Join<PathKeys<T>, ".">> = {
  language: ILanguage;
  key: P;
};

type VariableArgs<P extends Join<PathKeys<T>, ".">> = Variables<T, P, "."> extends never
  ? {
      vars?: never;
    }
  : {
      vars: Record<Variables<T, P, ".">, string>;
    };

type Args<P extends Join<PathKeys<T>, ".">> = BaseArgs<P> & VariableArgs<P>;

export const Translate = <P extends Join<PathKeys<T>, ".">>({
  language,
  key,
  vars,
}: Args<P>): JSX.Element => {
  const langTranslations = translations.get(language.code);

  const path = key.split(".");
  // @ts-ignore no point trying to make ts happy
  let value = langTranslations;
  for (const p of path) {
    // @ts-ignore no point trying to make ts happy
    value = value[p];
  }

  if (!value) {
    const english = translations.get("en");

    value = english;
    for (const p of path) {
      // @ts-ignore no point trying to make ts happy
      value = value[p];
    }
  }

  // replace variables
  if (vars && Object.keys(vars).length) {
    Object.keys(vars).forEach((variable) => {
      // @ts-ignore no point trying to make ts happy
      value = value.replace(`${variableStart}${variable}${variableEnd}`, vars[variable]);
    });
  }

  // @ts-ignore no point trying to make ts happy
  return <>value</>;
};

export const t = <P extends Join<PathKeys<T>, ".">>({ language, key, vars }: Args<P>): string => {
  const langTranslations = translations.get(language.code);

  const path = key.split(".");
  // @ts-ignore no point trying to make ts happy
  let value = langTranslations;
  for (const p of path) {
    // @ts-ignore no point trying to make ts happy
    value = value[p];
  }

  if (!value) {
    const english = translations.get("en");

    value = english;
    for (const p of path) {
      // @ts-ignore no point trying to make ts happy
      value = value[p];
    }
  }

  // replace variables
  if (vars && Object.keys(vars).length) {
    Object.keys(vars).forEach((variable) => {
      // @ts-ignore no point trying to make ts happy
      value = value.replace(`${variableStart}${variable}${variableEnd}`, vars[variable]);
    });
  }

  // @ts-ignore no point trying to make ts happy
  return value;
};

export const english: ILanguage = {
  code: "en",
  englishName: "English",
  nativeName: "English",
};

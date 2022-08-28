import { Language } from "../types.ts";
import { getDefaultTranslations, getTranslations } from "./index.ts";
import {
  Join,
  PathKeys,
  Variables,
  translationsType,
  variableEnd,
  variableStart,
} from "./types.ts";

type T = translationsType;

type Args<P extends Join<PathKeys<T>, ".">> = Variables<T, P, "."> extends never
  ? {
      language: Language;
      key: P;
      vars?: never;
    }
  : {
      language: Language;
      key: P;
      vars: Record<Variables<T, P, ".">, string>;
    };

export const t = <P extends Join<PathKeys<T>, ".">>({ language, key, vars }: Args<P>): string => {
  const langTranslations = getTranslations(language.code);

  const path = key.split(".");
  // @ts-ignore no point trying to make ts happy
  let value = langTranslations;
  for (const p of path) {
    // @ts-ignore no point trying to make ts happy
    value = value[p];
  }

  if (!value) {
    const english = getDefaultTranslations();

    // @ts-ignore no point trying to make ts happy
    value = english;
    for (const p of path) {
      // @ts-ignore no point trying to make ts happy
      value = value[p];
    }
  }

  if (vars && Object.keys(vars).length) {
    Object.keys(vars).forEach((variable) => {
      // @ts-ignore no point trying to make ts happy
      value = value.replace(`${variableStart}${variable}${variableEnd}`, vars[variable]);
    });
  }

  // @ts-ignore no point trying to make ts happy
  return value;
};

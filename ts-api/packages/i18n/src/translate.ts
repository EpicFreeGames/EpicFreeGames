import { ILanguage } from "@efg/types";

import { translations } from "./translations";
import { ITranslations, Join, PathKeys, Variables, variableEnd, variableStart } from "./types";

type T = ITranslations;

type Args<P extends Join<PathKeys<T>, ".">> = Variables<T, P, "."> extends never
  ? {
      language: ILanguage;
      key: P;
      vars?: never;
    }
  : {
      language: ILanguage;
      key: P;
      vars: Record<Variables<T, P, ".">, string>;
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

  if (vars && Object.keys(vars).length) {
    Object.keys(vars).forEach((variable) => {
      // @ts-ignore no point trying to make ts happy
      value = value.replace(
        `${variableStart}${variable}${variableEnd}`,
        (vars as any)[variable as any]
      );
    });
  }

  // @ts-ignore no point trying to make ts happy
  return value;
};

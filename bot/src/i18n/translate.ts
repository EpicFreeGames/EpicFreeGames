// deno-lint-ignore-file no-explicit-any
import { Language } from "../types.ts";
import { translations } from "./languages.ts";
import {
  Join,
  PathKeys,
  translationsType,
  variableEnd,
  Variables,
  variableStart,
} from "./types.ts";

type T = translationsType;

export const t = <P extends Join<PathKeys<T>, ".">>(
  language: Language,
  key: P,
  vars: Variables<T, P, "."> extends never
    ? undefined
    : Record<Variables<T, P, ".">, string>
): string => {
  const langTranslations = translations.get(language.code);

  const path = key.split(".");
  // @ts-ignore no point trying to make ts happy
  let value = langTranslations;
  for (const p of path) {
    // @ts-ignore no point trying to make ts happy
    value = value[p as any];
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

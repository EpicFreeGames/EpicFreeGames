import { useCallback } from "react";

import {
  ITranslations,
  Join,
  PathKeys,
  Variables,
  variableEnd,
  variableStart,
} from "@efg/i18n/types";

type T = ITranslations;

type BaseArgs<P extends Join<PathKeys<T>, ".">> = {
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

export const useT = (translations: Record<string, string>) =>
  useCallback(
    <P extends Join<PathKeys<T>, ".">>({ key, vars }: Args<P>): string => {
      const path = key.split(".");
      let value = translations;
      for (const p of path) {
        // @ts-ignore no point trying to make ts happy
        value = value[p];
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
    },
    [translations]
  );

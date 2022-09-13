import { Flag, Flags } from "@efg/types";

import { hasFlag } from "./useHasFlags";

export const useCalcFlags = (userFlags: number) => {
  const flags = Object.keys(Flags).filter((key) => {
    if (Number(key)) return false;

    if (hasFlag(userFlags, Flags[key as Flag])) return true;
  });

  return flags;
};

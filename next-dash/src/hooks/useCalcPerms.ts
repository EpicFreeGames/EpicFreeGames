import { Flag, Flags } from "~utils/api/flags";
import { hasFlag } from "./useHasPerms";

export const useCalcFlags = (userFlags: number) =>
  Object.keys(Flags).filter((key) => {
    if (Number(key)) return false;

    if (hasFlag(userFlags, Flags[key as Flag])) return true;
  });

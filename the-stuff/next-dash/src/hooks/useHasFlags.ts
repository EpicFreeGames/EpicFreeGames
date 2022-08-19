import { Flags } from "~utils/api/flags";

export const useHasFlags = (flags: number, ...requiredFlags: Flags[]) =>
  hasPermission(flags, requiredFlags);

const hasPermission = (flags: number, requiredFlags: Flags[]) => {
  const totalRequired = requiredFlags?.reduce((acc, flag) => acc | flag, 0);

  return hasFlag(flags, totalRequired);
};

export const hasFlag = (flags: number, requiredFlag: Flags) =>
  (flags & requiredFlag) === requiredFlag;

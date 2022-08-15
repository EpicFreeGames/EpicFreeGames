import { Flags } from "./flags";

export const hasPermission = (flags: number, requiredFlags: Flags[]) => {
  if (hasFlag(flags, Flags.ADMIN)) return true;

  const totalRequired = requiredFlags?.reduce((acc, flag) => acc | flag, 0);

  return hasFlag(flags, totalRequired);
};

export const hasFlag = (flags: number, requiredFlag: Flags) =>
  (flags & requiredFlag) === requiredFlag;

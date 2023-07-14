import { Flags } from "@efg/types";

export const hasPermission = (flags: number, requiredFlags: Flags[]) => {
  const totalRequired = requiredFlags?.reduce((acc, flag) => acc | flag, 0);

  return hasFlag(flags, totalRequired);
};

export const hasFlag = (flags: number, requiredFlag: Flags) =>
  (flags & requiredFlag) === requiredFlag;

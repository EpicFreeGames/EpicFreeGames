import { Flags } from "~utils/api/flags";
import { useUser } from "./useUser";

export const useHasPerms = (...flags: Flags[]) => {
  const user = useUser();

  return hasPermission(user?.flags ?? 0, flags);
};

const hasPermission = (flags: number, requiredFlags: Flags[]) => {
  if (hasFlag(flags, Flags.ADMIN)) return true;

  const totalRequired = requiredFlags?.reduce((acc, flag) => acc | flag, 0);

  return hasFlag(flags, totalRequired);
};

const hasFlag = (flags: number, requiredFlag: Flags) => (flags & requiredFlag) === requiredFlag;

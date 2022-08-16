import { useEffect } from "react";
import { useLogout } from "~utils/api/auth/logout";
import { useMe } from "~utils/api/users/me";
import { useIsBrowser } from "./useIsBrowser";

export const useUser = (required: boolean = true) => {
  const isBrowser = useIsBrowser();
  const logout = useLogout();

  const { data: me, error, isLoading } = useMe(required);

  useEffect(() => {
    if (!isBrowser || isLoading) return;

    if (error && required) return logout();
  }, [me, error, isLoading]);

  return me;
};

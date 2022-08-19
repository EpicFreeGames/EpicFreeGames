import { useEffect } from "react";

import { useLogout } from "~utils/api/auth/logout";
import { useMe } from "~utils/api/users/me";

export const useUser = (required: boolean = true) => {
  const logout = useLogout();

  const { data: user, error, isLoading } = useMe(required);

  useEffect(() => {
    if (!isLoading && error?.statusCode === 401 && required) return logout();
  }, [user, error, isLoading]);

  return { user, isLoading };
};

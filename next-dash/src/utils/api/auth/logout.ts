import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { ApiError, apiRequest } from "../api";

const logoutRequest = () =>
  apiRequest<void>({
    path: "/auth/logout",
    method: "POST",
  });

export const useLogout = () => {
  const router = useRouter();
  const qc = useQueryClient();

  const { mutate } = useMutation<void, ApiError>(logoutRequest, {
    onSettled: () => {
      qc.cancelQueries();
      qc.clear();
      router.push("/login");
    },
  });

  return mutate;
};

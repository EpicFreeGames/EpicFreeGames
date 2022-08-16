import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ApiError, apiRequest } from "../api";

const logoutRequest = () =>
  apiRequest<void>({
    path: "/auth/logout",
    method: "POST",
  });

export const useLogout = () => {
  const router = useRouter();

  const { mutate } = useMutation<void, ApiError>(logoutRequest, {
    onSettled: () => {
      router.push("/login");
    },
  });

  return mutate;
};

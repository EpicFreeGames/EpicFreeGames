import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, apiRequest } from "../api";
import { IUser } from "../types";
import { UserContext } from "./_sharedTypes";

export type AddUserProps = {
  identifier: string;
  flags: number;
  bot: boolean;
};

const addUserRequest = (props: AddUserProps) =>
  apiRequest<IUser>({
    method: "POST",
    path: "/users",
    body: props,
  });

export const useAddUserMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IUser, ApiError, AddUserProps, UserContext>(addUserRequest, {
    onSuccess: () => qc.invalidateQueries(["users"]),
  });

  return mutation;
};

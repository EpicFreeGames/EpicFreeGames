import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IUser } from "@efg/types";

import { ApiError, apiRequest } from "../api";
import { UserContext } from "./_sharedTypes";

export type AddUserProps = {
  identifier: string;
  flags: number;
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

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, apiRequest } from "../api";
import { IUser } from "../types";
import { UserContext } from "./_sharedTypes";

export type EditUserProps = {
  userId: string;
  data: {
    flags: number;
  };
};

const editUserRequest = ({ userId, data }: EditUserProps) =>
  apiRequest<IUser>({
    method: "PATCH",
    path: `/users/${userId}`,
    body: data,
  });

export const useEditUserMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IUser, ApiError, EditUserProps, UserContext>(editUserRequest, {
    onSuccess: () => qc.invalidateQueries(["users", "me"]),
  });

  return mutation;
};

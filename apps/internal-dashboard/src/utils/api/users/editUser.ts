import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IUser } from "@efg/types";

import { ApiError, apiRequest } from "../api";
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
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
      qc.invalidateQueries(["me"]);
    },
  });

  return mutation;
};

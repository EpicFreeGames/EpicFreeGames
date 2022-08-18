import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../api";
import { UserContext } from "./_sharedTypes";

type DeleteUserProps = {
  userId: string;
};

const deleteUserRequest = (props: DeleteUserProps) =>
  apiRequest<void>({
    path: `/users/${props.userId}`,
    method: "DELETE",
  });

export const useDeleteUserMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<void, ApiError, DeleteUserProps, UserContext>(deleteUserRequest, {
    onSuccess: () => qc.invalidateQueries(["users"]),
  });

  return mutation;
};

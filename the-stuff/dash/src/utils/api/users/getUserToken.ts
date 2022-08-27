import { useMutation } from "@tanstack/react-query";

import { ApiError, apiRequest } from "../api";

export type GetUserTokenProps = {
  identifier: string;
};

const getUserTokenRequest = (props: GetUserTokenProps) =>
  apiRequest<{ token: string }>({
    method: "POST",
    path: `/users/${props.identifier}/token`,
  });

export const useGetUserTokenMutation = () => {
  const mutation = useMutation<{ token: string }, ApiError, GetUserTokenProps>(getUserTokenRequest);

  return mutation;
};

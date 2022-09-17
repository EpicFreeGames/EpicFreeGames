import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ISending } from "@efg/types";

import { ApiError, apiRequest } from "../api";

export type AddSendingProps = {
  gameIds: string[];
};

const addSendingRequest = (props: AddSendingProps) =>
  apiRequest<ISending>({
    path: "/sends",
    method: "POST",
    body: props,
  });

export const useAddSendingMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<ISending, ApiError, AddSendingProps, any>(addSendingRequest, {
    onSuccess: () => {
      qc.invalidateQueries(["sends"]);
    },
  });

  return mutation;
};

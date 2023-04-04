import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ISending } from "@efg/types";

import { ApiError, apiRequest } from "../api";
import { SendingContext } from "./_sharedTypes";

export type EditSendingProps = {
  sendingId: string;
  updateData: { gameIds: string[] };
};

const editSendingRequest = ({ sendingId, updateData }: EditSendingProps) =>
  apiRequest<ISending>({
    path: `/sends/${sendingId}`,
    method: "PATCH",
    body: updateData,
  });

export const useEditSendingMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<ISending, ApiError, EditSendingProps, SendingContext>(
    editSendingRequest,
    {
      onSuccess: () => qc.invalidateQueries(["sends"]),
    }
  );

  return mutation;
};

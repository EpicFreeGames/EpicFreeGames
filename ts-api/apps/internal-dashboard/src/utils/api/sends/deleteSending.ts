import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, apiRequest } from "../api";
import { SendingContext } from "./_sharedTypes";

export type DeleteSendingProps = {
  sendingId: string;
};

const deleteSendingRequest = (props: DeleteSendingProps) =>
  apiRequest<void>({
    path: `/sends/${props.sendingId}`,
    method: "DELETE",
  });

export const useDeleteSendingMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<void, ApiError, DeleteSendingProps, SendingContext>(
    deleteSendingRequest,
    {
      onSuccess: () => {
        qc.invalidateQueries(["sends"]);
      },
    }
  );

  return mutation;
};

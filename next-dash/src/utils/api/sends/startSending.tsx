import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../api";
import { SendingContext } from "./_sharedTypes";

type StartSendingProps = {
  sendingId: string;
};

const startSendingRequest = (props: StartSendingProps) =>
  apiRequest<void>({
    method: "POST",
    path: `/sends/${props.sendingId}/send`,
  });

export const useStartSendingMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<void, ApiError, StartSendingProps, SendingContext>(
    startSendingRequest,
    {
      onSuccess: () => qc.invalidateQueries(["sends"]),
    }
  );

  return mutation;
};

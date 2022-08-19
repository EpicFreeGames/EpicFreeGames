import { useState } from "react";
import toast from "react-hot-toast";

import { useStartSendingMutation } from "~/utils/api/sends/startSending";
import { AlertDialog } from "~components/AlertDialog";
import { ISending } from "~utils/api/types";

import { arrayToCoolString } from "./DeleteSending";

type Props = {
  sending: ISending;
};

export const StartSending = ({ sending }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useStartSendingMutation();

  const onSubmit = async () => {
    await toast.promise(mutateAsync({ sendingId: sending.id }), {
      success: "Sending started",
      error: "Error starting sending",
      loading: "Starting sending",
    });

    setDialogOpen(false);
  };

  const names = arrayToCoolString(sending.games?.map((g) => g.displayName) ?? []);

  return (
    <AlertDialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Start sending"
      description={`Are you sure you want to start sending ${names}?${
        sending.status === "SENDING" &&
        " Status is SENDING, only send if the sender has crashed etc"
      }`}
      trigger={<button className="btnBase hover:bg-gray-700/80 active:bg-gray-700/60">Send</button>}
      action={
        <button
          onClick={() => onSubmit()}
          className="btnBase border-[1px] border-blue-500 bg-blue-800/60 py-[0.3rem] text-[0.95rem] hover:bg-blue-700/80 active:bg-blue-600/80"
        >
          Yes, start sending
        </button>
      }
    />
  );
};

import { useState } from "react";
import toast from "react-hot-toast";

import { ISending } from "@efg/types";

import { useStartSendingMutation } from "~/utils/api/sends/startSending";
import { AlertDialog } from "~components/AlertDialog";

import { arrayToCoolString } from "./DeleteSending";

type Props = {
  sending: ISending;
};

export const StartSending = ({ sending }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [failedOnly, setFailedOnly] = useState(false);

  const failedOnlyText = failedOnly ? "only failed" : "all";

  const { mutateAsync } = useStartSendingMutation();

  const onSubmit = async () => {
    await toast.promise(
      mutateAsync({ sendingId: sending.id, failedOnly: failedOnly ? "1" : "0" }),
      {
        success: `Sending started to ${failedOnlyText} servers`,
        error: `Error starting sending to ${failedOnlyText} servers`,
        loading: `Starting sending to ${failedOnlyText} servers`,
      }
    );

    setDialogOpen(false);
  };

  const names = arrayToCoolString(sending.games?.map((g) => g.displayName) ?? []);

  return (
    <AlertDialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Start sending"
      description={`Are you sure you want to start sending ${names}?`}
      trigger={<button className="btnBase hover:bg-gray-700/80 active:bg-gray-700/60">Send</button>}
      action={
        <button
          onClick={() => onSubmit()}
          className="btnBase border-[1px] border-blue-500 bg-blue-800/60 py-[0.3rem] text-[0.95rem] hover:bg-blue-700/80 active:bg-blue-600/80"
        >
          Yes, start sending
        </button>
      }
    >
      <label className="flex items-center gap-4">
        <input
          className="h-5 w-5"
          type="checkbox"
          checked={failedOnly}
          onChange={() => setFailedOnly(!failedOnly)}
        />
        Send to failed servers only
      </label>
    </AlertDialog>
  );
};

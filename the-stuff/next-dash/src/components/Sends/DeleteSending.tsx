import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "tabler-icons-react";

import { AlertDialog } from "~components/AlertDialog";
import { useDeleteSendingMutation } from "~utils/api/sends/deleteSending";
import { ISending } from "~utils/api/types";

type Props = {
  sending: ISending;
};
export const arrayToCoolString = (array: string[]): string | undefined => {
  if (!array.length) return undefined;

  if (array.length === 1) return array[0];

  const formatter = new Intl.ListFormat("en-US", { style: "long", type: "conjunction" });

  return formatter.format(array);
};

export const DeleteSending = ({ sending }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useDeleteSendingMutation();

  const onSubmit = async () => {
    await toast.promise(mutateAsync({ sendingId: sending.id }), {
      success: "Sending deleted",
      error: "Error deleting sending",
      loading: "Deleting sending",
    });

    setDialogOpen(false);
  };

  const names = arrayToCoolString(sending.games?.map((g) => g.displayName) ?? []);

  return (
    <AlertDialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Delete sending"
      description={`Are you sure you want to delete sending with ${names}?`}
      trigger={
        <button className="btnBase px-2 hover:bg-gray-700/80 active:bg-gray-700/60">
          <Trash strokeWidth={1.3} size={21} className="text-red-500" />
        </button>
      }
      action={
        <button
          onClick={() => onSubmit()}
          className="btnBase border-[1px] border-red-500 bg-red-800/60 py-[0.3rem] text-[0.95rem] hover:bg-red-700/80 active:bg-red-600/80"
        >
          Yes, delete
        </button>
      }
    />
  );
};

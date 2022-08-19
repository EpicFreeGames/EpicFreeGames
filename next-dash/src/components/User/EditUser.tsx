import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Edit } from "tabler-icons-react";

import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Label } from "~components/Label";
import { useCalcFlags } from "~hooks/useCalcFlags";
import { Flag, Flags } from "~utils/api/flags";
import { IUser } from "~utils/api/types";
import { EditUserProps, useEditUserMutation } from "~utils/api/users/editUser";

import { SelectFlags } from "./SelectFlags";

type Props = {
  user: IUser;
};

export const EditUser = ({ user }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useEditUserMutation();

  const form = useForm({
    defaultValues: {
      flags: user.flags,
    },
  });

  const onSubmit = async (data: EditUserProps["data"]) => {
    await toast.promise(mutateAsync({ userId: user.id, data }), {
      success: "User edited",
      error: "Error editing user",
      loading: "Editing user",
    });

    setDialogOpen(false);
  };

  const flags = useCalcFlags(user.flags);
  const defaultValue = flags.map((f) => ({ label: f, value: Flags[f as Flag] }));

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title={`Edit ${user.name ?? user.discordId}`}
      trigger={
        <button className="btnBase px-2 hover:bg-gray-700/80 active:bg-gray-700/60">
          <Edit strokeWidth={1.3} size={21} />
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label required htmlFor="flags">
            Flags
          </Label>

          <SelectFlags
            onChange={(newValue, newFlags) => form.setValue("flags", newFlags)}
            defaultValue={defaultValue}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <DialogCloseButton className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
            Cancel
          </DialogCloseButton>

          <button
            type="submit"
            className="btnBase border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
};

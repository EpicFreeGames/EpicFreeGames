import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Input } from "~components/Input";
import { Label } from "~components/Label";
import { useAddUserMutation, AddUserProps } from "~utils/api/users/addUser";
import { SelectFlags } from "./SelectFlags";

export const AddUser = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useAddUserMutation();

  const form = useForm<AddUserProps>({
    defaultValues: {
      flags: 0,
    },
  });

  const onSubmit = async (props: AddUserProps) => {
    await toast.promise(mutateAsync(props), {
      success: "User added",
      error: "Error adding user",
      loading: "Adding user",
    });

    setDialogOpen(false);
  };

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Add a user"
      trigger={
        <button className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
          Add a user
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Input label="Discord ID" {...form.register("discordId")} required />

          <div className="flex flex-col gap-2">
            <Label htmlFor="flags">Flags</Label>

            <SelectFlags onChange={(newValue, newFlags) => form.setValue("flags", newFlags)} />
          </div>

          <div className="flex gap-2 justify-between items-center">
            <DialogCloseButton className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
              Cancel
            </DialogCloseButton>

            <button
              type="submit"
              className="btnBase border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

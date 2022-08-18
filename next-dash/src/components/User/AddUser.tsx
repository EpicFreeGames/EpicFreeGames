import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog } from "~components/Dialog";
import { Input } from "~components/Input";
import { Label } from "~components/Label";
import { Flags } from "~utils/api/flags";
import { MultiSelect } from "react-multi-select-component";

import { useAddUserMutation, AddUserProps } from "~utils/api/users/addUser";

type Option = { label: string; value: Flags };

export const AddUser = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [flags, setFlags] = useState(0);
  const [value, setValue] = useState<Option[]>([]);

  const { mutateAsync } = useAddUserMutation();

  const form = useForm<AddUserProps>();

  const onSubmit = async (props: AddUserProps) => {
    await toast.promise(mutateAsync(props), {
      success: "User added",
      error: "Error adding user",
      loading: "Adding user",
    });

    setDialogOpen(false);
  };

  const options = [
    { label: "Admin", value: Flags.ADMIN },
    { label: "GetUsers", value: Flags.GetUsers },
  ];

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
            <Label required htmlFor="flags">
              Select flags
            </Label>

            <MultiSelect
              className="dark"
              options={options}
              value={value}
              onChange={(newValue: Option[]) => {
                setValue(newValue);
              }}
              labelledBy="Permissions"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

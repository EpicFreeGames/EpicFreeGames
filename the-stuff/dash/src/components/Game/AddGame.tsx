import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Input } from "~components/Input";
import { AddGameProps, useAddGameMutation } from "~utils/api/games/addGame";

export const AddGame = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useAddGameMutation();

  const form = useForm<AddGameProps>();

  const onSubmit = async (values: AddGameProps) => {
    await toast.promise(mutateAsync(values), {
      success: "Game added",
      error: "Error adding game",
      loading: "Adding game",
    });

    setDialogOpen(false);
    form.reset();
  };

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Add a game"
      trigger={
        <button className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
          Add a game
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input label="Name" required {...form.register("name")} />
        <Input label="Display name" required {...form.register("displayName")} />
        <Input label="Path" required {...form.register("path")} />
        <Input label="Image URL" required {...form.register("imageUrl")} />
        <Input label="Sale starts" type="datetime-local" required {...form.register("start")} />
        <Input label="Sale ends" type="datetime-local" required {...form.register("end")} />
        <Input label="USD Price ($19.99)" required {...form.register("usdPrice")} />
        <Input
          label="Price value (19.99)"
          required
          {...form.register("priceValue", { valueAsNumber: true })}
        />

        <div className="flex items-center justify-between gap-2">
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
      </form>
    </Dialog>
  );
};

import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Input } from "~components/Input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AddGameProps, useAddGameMutation } from "~utils/api/games/addGame";

export const AddGame = () => {
  const { mutateAsync } = useAddGameMutation();

  const form = useForm<AddGameProps>();

  const onSubmit = (values: AddGameProps) =>
    toast.promise(mutateAsync(values), {
      success: "Adding game",
      error: "Error adding game",
      loading: "Game added",
    });

  return (
    <Dialog
      title="Add a game"
      trigger={
        <button className="btnBase p-2 bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
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

        <div className="flex gap-2 justify-between items-center">
          <DialogCloseButton className="btnBase p-2 bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
            Cancel
          </DialogCloseButton>

          <button
            type="submit"
            className="btnBase py-2 px-2 border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
};
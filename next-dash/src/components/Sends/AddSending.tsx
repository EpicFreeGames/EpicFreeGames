import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Label } from "~components/Label";
import { useGames } from "~utils/api/games/getGames";
import { AddSendingProps, useAddSendingMutation } from "~utils/api/sends/addSending";

export const AddSending = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useAddSendingMutation();

  const form = useForm<AddSendingProps>();

  const onSubmit = async (values: AddSendingProps) => {
    await toast.promise(mutateAsync(values), {
      success: "Sending added",
      error: "Error adding sending",
      loading: "Adding sending",
    });

    setDialogOpen(false);
  };

  const { data: games, isLoading } = useGames();

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Add a sending"
      trigger={
        <button className="btnBase bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60">
          Add a sending
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label required htmlFor="games">
            Select games
          </Label>

          <select
            id="games"
            className="focus appearance-none rounded-md bg-gray-600 p-2"
            defaultValue={[]}
            multiple
            required
            {...form.register("gameIds")}
          >
            {isLoading ? (
              <option>Loading...</option>
            ) : games ? (
              games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))
            ) : (
              <option>No games</option>
            )}
          </select>
        </div>

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

import { Edit } from "tabler-icons-react";
import { Dialog, DialogCloseButton } from "~components/Dialog";
import { Input } from "~components/Input";
import { useForm } from "react-hook-form";
import { getHtmlDate } from "~utils/getHtmlDate";
import { EditGameProps, useEditGameMutation } from "~utils/api/games/editGame";
import toast from "react-hot-toast";
import { useState } from "react";
import { IGame } from "~utils/api/types";

type Props = {
  game: IGame;
};

export const EditGame = ({ game }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useEditGameMutation();

  const { prices, sendingId, id, ...rest } = game;

  const form = useForm({
    defaultValues: {
      ...rest,
      start: getHtmlDate(rest.start),
      end: getHtmlDate(rest.end),
    },
  });

  const onSubmit = async (values: EditGameProps["updateData"]) => {
    await toast.promise(mutateAsync({ gameId: game.id, updateData: values }), {
      success: "Changes saved",
      error: "Error saving changes",
      loading: "Saving changes",
    });

    setDialogOpen(false);
  };

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title={`Edit ${game.name}`}
      trigger={
        <button className="btnBase px-2 hover:bg-gray-700/80 active:bg-gray-700/60">
          <Edit strokeWidth={1.3} size={21} />
        </button>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input label="Name" defaultValue={game.name} required {...form.register("name")} />
        <Input
          label="Display name"
          defaultValue={game.displayName}
          required
          {...form.register("displayName")}
        />
        <Input label="Path" defaultValue={game.path} required {...form.register("path")} />
        <Input
          label="Image URL"
          defaultValue={game.imageUrl}
          required
          {...form.register("imageUrl")}
        />
        <Input label="Sale starts" type="datetime-local" required {...form.register("start")} />
        <Input label="Sale ends" type="datetime-local" required {...form.register("end")} />

        <div className="flex gap-2 justify-between items-center">
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

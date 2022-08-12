import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "tabler-icons-react";
import { AlertDialog } from "~components/AlertDialog";
import { IGame } from "~types";
import { useDeleteGameMutation } from "~utils/api/games/deleteGame";

type Props = {
  game: IGame;
};

export const DeleteGame = ({ game }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useDeleteGameMutation();

  const onSubmit = async () => {
    await toast.promise(mutateAsync({ gameId: game.id }), {
      success: "Game deleted",
      error: "Error deleting game",
      loading: "Deleting game",
    });

    setDialogOpen(false);
  };

  return (
    <AlertDialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Delete game"
      description={`Are you sure you want to delete ${game.displayName}?`}
      trigger={
        <button className="btnBase px-3 bg-gray-800 hover:bg-gray-900/80 active:bg-gray-900">
          <Trash strokeWidth={1.3} size={21} className="text-red-500" />
        </button>
      }
      action={
        <button
          onClick={() => onSubmit()}
          className="btnBase px-2 py-[0.3rem] text-[0.95rem] border-[1px] border-red-500 bg-red-800/60 hover:bg-red-700/80 active:bg-red-600/80"
        >
          Yes, delete
        </button>
      }
    />
  );
};

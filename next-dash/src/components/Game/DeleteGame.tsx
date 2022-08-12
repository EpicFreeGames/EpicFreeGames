import { Trash } from "tabler-icons-react";
import { AlertDialog } from "~components/AlertDialog";
import { IGame } from "~types";

type Props = {
  game: IGame;
};

export const DeleteGame = ({ game }: Props) => (
  <AlertDialog
    title="Delete game"
    description={`Are you sure you want to delete ${game.displayName}?`}
    trigger={
      <button className="btnBase px-3 bg-gray-800 hover:bg-gray-900/80 active:bg-gray-900">
        <Trash strokeWidth={1.4} size={23} className="text-red-500" />
      </button>
    }
    action={
      <button className="btnBase py-2 px-2 border-[1px] border-red-500 bg-red-800/60 hover:bg-red-700/80 active:bg-red-600/80">
        Yes, delete
      </button>
    }
  />
);

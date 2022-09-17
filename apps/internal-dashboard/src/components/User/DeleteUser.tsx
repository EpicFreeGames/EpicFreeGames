import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "tabler-icons-react";

import { IUser } from "@efg/types";

import { AlertDialog } from "~components/AlertDialog";
import { useDeleteUserMutation } from "~utils/api/users/deleteUser";

type Props = {
  user: IUser;
};

export const DeleteUser = ({ user }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync } = useDeleteUserMutation();

  const onSubmit = async () => {
    await toast.promise(mutateAsync({ userId: user.id }), {
      success: "User deleted",
      error: "Error deleting user",
      loading: "Deleting user",
    });

    setDialogOpen(false);
  };

  return (
    <AlertDialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Delete user"
      description={`Are you sure you want to delete ${user.name ?? user.identifier}`}
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

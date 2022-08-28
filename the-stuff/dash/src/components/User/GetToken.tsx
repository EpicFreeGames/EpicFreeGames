import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Id } from "tabler-icons-react";

import { Dialog } from "~components/Dialog";
import { Label } from "~components/Label";
import { IUser } from "~utils/api/types";
import { useGetUserTokenMutation } from "~utils/api/users/getUserToken";

type Props = {
  user: IUser;
};

export const GetToken = ({ user }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [token, setToken] = useState("");

  const { mutateAsync, isLoading, isError } = useGetUserTokenMutation();

  const getToken = async () => {
    const response = await toast.promise(mutateAsync({ identifier: user.identifier }), {
      success: "Token generated",
      error: "Error generating token",
      loading: "Generating token",
    });

    response.token && setToken(response.token);
  };

  const copySuccess = () => toast.success("Copied token to clipboard!");

  const copyFail = () => toast.error("Failed to copy token to clipboard!");

  const copy = () => {
    if (!token) return toast.error("Nothing to copy!");

    if (!navigator.clipboard) {
      console.log("Failed to copy text to clipboard - cause:", "Clipboard API not supported");
      copyFail();
    } else {
      try {
        navigator.clipboard.writeText(token);
        copySuccess();
      } catch (err) {
        console.log("Failed to copy text to clipboard - cause:", err);
        copyFail();
      }
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      title={`Get token for ${user.identifier}`}
      trigger={
        <button className="btnBase px-2 hover:bg-gray-700/80 active:bg-gray-700/60">
          <Id strokeWidth={1.3} size={21} />
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        <button
          className="btnBase bg-gray-600 hover:bg-gray-500/90 active:bg-gray-400/90"
          onClick={() => getToken()}
        >
          Get token
        </button>

        <div className="flex flex-col gap-1">
          <Label htmlFor="token">Token</Label>

          <div className="flex items-center justify-between gap-2 rounded-md bg-gray-700 p-2">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
              {isLoading
                ? "Loading..."
                : isError
                ? "Error generating token"
                : token?.length
                ? token
                : "No token"}
            </p>

            <button
              className="btnBase bg-gray-800 px-2 hover:bg-gray-900/80 active:bg-gray-900/90"
              onClick={() => copy()}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

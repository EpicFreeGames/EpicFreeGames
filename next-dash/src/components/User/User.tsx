import { useCalcFlags } from "~hooks/useCalcFlags";
import { useHasFlags } from "~hooks/useHasFlags";
import { useUser } from "~hooks/useUser";
import { Flags } from "~utils/api/flags";
import { IUser } from "~utils/api/types";
import { DeleteUser } from "./DeleteUser";
import { EditUser } from "./EditUser";

type Props = {
  user: IUser;
};

export const User = ({ user }: Props) => {
  const { user: currentUser } = useUser();
  const currentUserFlags = currentUser?.flags ?? 0;

  const flags = useCalcFlags(user.flags);

  const canEdit = useHasFlags(currentUserFlags, Flags.EditUsers);
  const canDelete = useHasFlags(currentUserFlags, Flags.DeleteUsers);

  const showButtons = canEdit || canDelete;

  return (
    <div className="bg-gray-700 p-3 rounded-md flex flex-col gap-3">
      <div className="flex gap-2 justify-between w-full h-full flex-col halfMax:flex-row items-start">
        <h2 className="bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl">
          {user.name ?? user.discordId}
        </h2>

        {showButtons && (
          <div className="flex gap-1 p-2 bg-gray-800 rounded-lg">
            {canEdit && <EditUser user={user} />}
            {canDelete && <DeleteUser user={user} />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Spec title="Flags" value={flags.length ? flags.join(", ") : "None"} />
      </div>
    </div>
  );
};

const Spec = ({ title, value }: { title: string; value: string | number }) => (
  <p className={`bg-gray-800 p-3 rounded-md`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);

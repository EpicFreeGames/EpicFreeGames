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

  const canGetToken = useHasFlags(currentUserFlags, Flags.GetTokens);

  const showButtons = canEdit || canDelete || canGetToken;

  return (
    <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
      <div className="flex h-full w-full flex-col items-start justify-between gap-2 md:flex-row">
        <h2 className="rounded-md bg-gray-800 py-2 px-3 text-lg md:text-2xl">
          {user.name ?? user.identifier}
        </h2>

        {showButtons && (
          <div className="flex gap-1 rounded-lg bg-gray-800 p-2">
            {canEdit && <EditUser user={user} />}
            {canDelete && <DeleteUser user={user} />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Spec title="Flags" value={flags.length ? flags.join(", ") : "None"} />
        <Spec title="Bot" value={user.bot ? "Yes" : "Nope"} />
      </div>
    </div>
  );
};

const Spec = ({ title, value }: { title: string; value: string | number }) => (
  <p className={`rounded-md bg-gray-800 p-3`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);

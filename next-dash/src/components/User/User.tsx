import { useCalcFlags } from "~hooks/useCalcPerms";
import { IUser } from "~utils/api/types";

type Props = {
  user: IUser;
};

export const User = ({ user }: Props) => {
  const perms = useCalcFlags(user.flags);

  return (
    <div className="bg-gray-700 p-3 rounded-md flex flex-col gap-3">
      <div className="flex gap-2 justify-between w-full h-full flex-col halfMax:flex-row items-start">
        <h2 className="bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl">
          {user.name ?? user.discordId}
        </h2>

        <div className="flex gap-1 p-2 bg-gray-800 rounded-lg"></div>
      </div>

      <div className="flex flex-col gap-2">
        <Spec title="Permissions" value={perms.join(", ")} />
      </div>
    </div>
  );
};

const Spec = ({
  title,
  value,
  wordWrap,
}: {
  title: string;
  value: string | number;
  wordWrap?: boolean;
}) => (
  <p className={`bg-gray-800 p-3 rounded-md ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);

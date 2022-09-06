import { useUser } from "~hooks/useUser";
import { useLogout } from "~utils/api/auth/logout";

export const Logout = () => {
  const logout = useLogout();
  const { user } = useUser();

  const onClick = (e: any) => logout();

  return (
    <button
      className="focus flex items-center justify-center rounded-md border-[1px] border-gray-700 bg-gray-800 px-1 text-sm"
      onClick={onClick}
    >
      {user?.name ?? user?.identifier}
    </button>
  );
};

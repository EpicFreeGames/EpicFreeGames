import { useUser } from "~hooks/useUser";
import { useLogout } from "~utils/api/auth/logout";

export const Logout = () => {
  const logout = useLogout();
  const { user } = useUser();

  const onClick = (e: any) => logout();

  return (
    <button
      className="btnBase bg-gray-600 hover:bg-gray-500/90 active:bg-gray-400/90"
      onClick={onClick}
    >
      {user?.name ?? user?.identifier}
    </button>
  );
};

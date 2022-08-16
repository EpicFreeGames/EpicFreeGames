import { useLogout } from "~utils/api/auth/logout";

export const Logout = () => {
  const logout = useLogout();

  const onClick = (e: any) => logout();

  return (
    <button
      className="btnBase bg-gray-600 hover:bg-gray-500/90 active:bg-gray-400/90"
      onClick={onClick}
    >
      Logout
    </button>
  );
};
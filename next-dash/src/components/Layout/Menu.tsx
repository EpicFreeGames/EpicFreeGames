import { DropdownMenu, DropdownMenuItem } from "~components/DropdownMenu";
import { useHasFlags } from "~hooks/useHasFlags";
import { useUser } from "~hooks/useUser";
import { Flags } from "~utils/api/flags";

export const Menu = () => {
  const { user } = useUser();
  const userFlags = user?.flags ?? 0;

  const showGames = useHasFlags(userFlags, Flags.GetGames);
  const showCurrencies = useHasFlags(userFlags, Flags.GetCurrencies);
  const showSends = useHasFlags(userFlags, Flags.GetSendings);
  const showUsers = useHasFlags(userFlags, Flags.GetUsers);

  const showMenu = showGames || showCurrencies || showSends || showUsers;

  if (!showMenu) return null;

  return (
    <DropdownMenu
      trigger={
        <button className="btnBase bg-gray-600 hover:bg-gray-500/90 active:bg-gray-400/90">
          Menu
        </button>
      }
    >
      <DropdownMenuItem>test</DropdownMenuItem>
    </DropdownMenu>
  );
};

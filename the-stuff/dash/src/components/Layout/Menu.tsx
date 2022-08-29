import { DropdownMenu, DropdownMenuLinkItem } from "~components/DropdownMenu";
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
    <DropdownMenu>
      <DropdownMenuLinkItem href="/">Home</DropdownMenuLinkItem>
      <DropdownMenuLinkItem href="/games">Games</DropdownMenuLinkItem>
      <DropdownMenuLinkItem href="/currencies">Currencies</DropdownMenuLinkItem>
      <DropdownMenuLinkItem href="/languages">Languages</DropdownMenuLinkItem>
      <DropdownMenuLinkItem href="/users">Users</DropdownMenuLinkItem>
      <DropdownMenuLinkItem href="/sends">Sends</DropdownMenuLinkItem>
      <DropdownMenuLinkItem href="/dash">Dashboard</DropdownMenuLinkItem>
    </DropdownMenu>
  );
};

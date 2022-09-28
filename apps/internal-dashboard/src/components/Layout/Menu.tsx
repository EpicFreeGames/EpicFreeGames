import { Flags } from "@efg/types";

import { DropdownMenu, DropdownMenuLinkItem } from "~components/DropdownMenu";
import { useHasFlags } from "~hooks/useHasFlags";
import { useUser } from "~hooks/useUser";

export const Menu = () => {
  const { user } = useUser();
  const userFlags = user?.flags ?? 0;

  const showGames = useHasFlags(userFlags, Flags.GetGames);
  const showCurrencies = useHasFlags(userFlags, Flags.GetCurrencies);
  const showLanguages = useHasFlags(userFlags, Flags.GetLanguages);
  const showSends = useHasFlags(userFlags, Flags.GetSendings);
  const showUsers = useHasFlags(userFlags, Flags.GetUsers);

  const showMenu = showGames || showCurrencies || showLanguages || showSends || showUsers;

  if (!showMenu) return null;

  return (
    <DropdownMenu>
      <DropdownMenuLinkItem href="/">Home</DropdownMenuLinkItem>
      {showGames && <DropdownMenuLinkItem href="/games">Games</DropdownMenuLinkItem>}
      {showCurrencies && <DropdownMenuLinkItem href="/currencies">Currencies</DropdownMenuLinkItem>}
      {showLanguages && <DropdownMenuLinkItem href="/languages">Languages</DropdownMenuLinkItem>}
      {showUsers && <DropdownMenuLinkItem href="/users">Users</DropdownMenuLinkItem>}
      {showSends && <DropdownMenuLinkItem href="/sends">Sends</DropdownMenuLinkItem>}
    </DropdownMenu>
  );
};

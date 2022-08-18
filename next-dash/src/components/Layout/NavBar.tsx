import Link from "next/link";
import { ReactNode } from "react";
import { useUser } from "~hooks/useUser";
import { Flags } from "~utils/api/flags";
import { useHasFlags } from "../../hooks/useHasFlags";
import { Logout } from "./Logout";

export const NavBar = () => {
  const { user } = useUser();
  const userFlags = user?.flags ?? 0;

  const showGames = useHasFlags(userFlags, Flags.GetGames);
  const showCurrencies = useHasFlags(userFlags, Flags.GetCurrencies);
  const showSends = useHasFlags(userFlags, Flags.GetSendings);
  const showUsers = useHasFlags(userFlags, Flags.GetUsers);

  return (
    <nav className="bg-gray-800">
      <div className="max-w-screen-lg mx-auto flex justify-between p-3 halfMax:p-4">
        <div className="flex gap-3 halfMax:gap-4">
          {showGames && <NavLink href="/games">Games</NavLink>}
          {showCurrencies && <NavLink href="/currencies">Currencies</NavLink>}
          {showSends && <NavLink href="/sends">Sends</NavLink>}
          {showUsers && <NavLink href="/users">Users</NavLink>}
        </div>

        <Logout />
      </div>
    </nav>
  );
};

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <Link href={href} passHref>
    <a className="btnBase bg-gray-600 hover:bg-gray-500/90 active:bg-gray-400/90">{children}</a>
  </Link>
);

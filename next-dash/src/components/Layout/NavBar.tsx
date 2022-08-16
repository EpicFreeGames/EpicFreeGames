import Link from "next/link";
import { ReactNode } from "react";
import { Flags } from "~utils/api/flags";
import { useHasPerms } from "../../hooks/useHasPerms";
import { Logout } from "./Logout";

export const NavBar = () => {
  const showGames = useHasPerms(Flags.GetGames);
  const showCurrencies = useHasPerms(Flags.GetCurrencies);
  const showSends = useHasPerms(Flags.GetSendings);

  return (
    <nav className="bg-gray-800">
      <div className="max-w-screen-lg mx-auto flex justify-between p-3 halfMax:p-4">
        <div className="flex gap-3 halfMax:gap-4">
          {showGames && <NavLink href="/games">Games</NavLink>}
          {showCurrencies && <NavLink href="/currencies">Currencies</NavLink>}
          {showSends && <NavLink href="/sends">Sends</NavLink>}
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

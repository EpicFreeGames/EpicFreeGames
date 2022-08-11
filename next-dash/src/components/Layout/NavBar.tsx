import Link from "next/link";
import { ReactNode } from "react";

export const NavBar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-screen-lg mx-auto flex justify-between p-3 halfMax:p-4">
        <div className="flex gap-3 halfMax:gap-4">
          <NavLink href="/games">Games</NavLink>
          <NavLink href="/currencies">Currencies</NavLink>
          <NavLink href="/sends">Sends</NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <Link href={href} passHref>
    <a className="btnBase p-2 bg-gray-600 hover:bg-gray-500/90 active:bg-gray-400/90">{children}</a>
  </Link>
);

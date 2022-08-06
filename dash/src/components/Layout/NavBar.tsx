/** @jsx h */
/** @jsxFrag Fragment */
import { Logout } from "icons";
import { ComponentChildren, h } from "preact";
import { tw } from "twind";

export const NavBar = () => {
  return (
    <nav className={tw`bg-gray-800`}>
      <div className={tw`max-w-screen-lg mx-auto flex justify-between p-3 halfMax:p-4`}>
        <div className={tw`flex gap-3 halfMax:gap-4`}>
          <NavLink href="/games">Games</NavLink>
          <NavLink href="/currencies">Currencies</NavLink>
          <NavLink href="/sends">Sends</NavLink>
        </div>

        <a className={tw`iconBtn btn-gray`} href="/logout">
          <Logout />
        </a>
      </div>
    </nav>
  );
};

const NavLink = ({ children, href }: { children: ComponentChildren; href: string }) => (
  <a tabIndex={1} href={href} className={tw`btn-gray cursor-pointer`}>
    {children}
  </a>
);

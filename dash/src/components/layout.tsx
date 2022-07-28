/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, h } from "preact";
import { tw } from "twind";
import { Base } from "./base.tsx";

type Props = {
  children: ComponentChildren;
  title: string;
};

export const Layout = ({ children, title }: Props) => (
  <Base title={title}>
    <nav className={tw`bg-gray-800`}>
      <div className={tw`max-w-screen-lg mx-auto flex justify-between p-4`}>
        <div className={tw`flex gap-4`}>
          <NavLink href="/dash/games">Games</NavLink>
          <NavLink href="/dash/i18n">I18n</NavLink>
        </div>

        <NavLink href="/api/logout">Logout</NavLink>
      </div>
    </nav>

    <main className={tw`p-4 max-w-screen-lg mx-auto`}>{children}</main>
  </Base>
);

const NavLink = ({ children, href }: { children: ComponentChildren; href: string }) => (
  <a href={href} className={tw`px-3 py-2 bg-gray-700 rounded-md`}>
    {children}
  </a>
);

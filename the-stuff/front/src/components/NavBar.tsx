import { ReactNode } from "react";

export const NavBar = () => (
  <nav className="sticky inset-0 z-10 bg-gray-900/50 backdrop-blur-sm">
    <div className="mx-auto flex max-w-screen-sm items-center gap-5 p-3 py-5">
      <Navlink href="/commands">Commands</Navlink>
      <Navlink href="/tutorial">Tutorial</Navlink>
      <Navlink href="/faq">FAQ</Navlink>
    </div>
  </nav>
);

const Navlink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="items-center justify-center rounded-md font-bold transition-all duration-200"
  >
    {children}
  </a>
);

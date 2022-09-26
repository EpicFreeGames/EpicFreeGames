import { Logout } from "./Logout";
import { Menu } from "./Menu";

export const NavBar = () => (
  <nav className="fixed z-10 w-full bg-gray-900/50 backdrop-blur-sm">
    <div className="nav-bar mx-auto flex h-[3.5rem] max-w-screen-lg items-center justify-between gap-3 px-3">
      <Menu />

      <Logout />
    </div>
  </nav>
);

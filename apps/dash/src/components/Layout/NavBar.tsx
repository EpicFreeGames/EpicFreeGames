import { Logout } from "./Logout";
import { Menu } from "./Menu";

export const NavBar = () => (
  <nav className="sticky inset-0 z-10 bg-gray-900/50 backdrop-blur-sm">
    <div className="mx-auto flex max-w-screen-lg justify-between p-3 md:p-4">
      <Menu />

      <Logout />
    </div>
  </nav>
);

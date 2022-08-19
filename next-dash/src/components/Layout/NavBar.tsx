import { Logout } from "./Logout";
import { Menu } from "./Menu";

export const NavBar = () => (
  <nav className="bg-gray-800">
    <div className="mx-auto flex max-w-screen-lg justify-between p-3 md:p-4">
      <Menu />

      <Logout />
    </div>
  </nav>
);

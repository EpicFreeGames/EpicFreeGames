import { FC, ReactNode } from "react";
import { Link } from "tabler-icons-react";
import { useHasMounted } from "../../../hooks/useHasMounted";
import { useNavItemStyles } from "./NavItem.styles";

export const NavDrawerItem: FC<{ to: string; children: ReactNode }> = ({ to, children }) => (
  <Link to={to} className={useNavItemStyles().classes.item}>
    {children}
  </Link>
);

export const HomeNavItem = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const atHome = window.location.pathname === "/";
  if (atHome) return null;

  return <NavDrawerItem to="/">Home</NavDrawerItem>;
};

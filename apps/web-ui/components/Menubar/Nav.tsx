import { createStyles, Drawer, Tooltip, useMantineTheme } from "@mantine/core";
import { FC, ReactNode, useState } from "react";
import { Menu2 } from "tabler-icons-react";
import { useHasMounted } from "../../hooks/useHasMounted";
import { Button } from "../Button";
import { FlexDiv } from "../FlexDiv";
import { Link } from "../Link";

export const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavButton setOpen={setOpen} />
      <NavDrawer open={open} setOpen={setOpen} />
    </>
  );
};

const NavButton: FC<{ setOpen: (open: boolean) => void }> = ({ setOpen }) => {
  return (
    <Tooltip label="Navigation">
      <Button onClick={() => setOpen(true)} p={"0.5rem"}>
        <Menu2 />
      </Button>
    </Tooltip>
  );
};

const styles = createStyles((theme) => ({
  item: {
    all: "unset",
    padding: "1.2rem 1rem",
    width: "100%",
    transition: "0.07s ease-in-out all",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
      border: "none",
      cursor: "pointer",
    },

    "&:focus": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
      border: "none",
      cursor: "pointer",
    },
  },
}));

const HomeNavItem = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const atHome = window.location.pathname === "/";
  if (atHome) return null;

  return <NavDrawerItem to="/">Home</NavDrawerItem>;
};

const NavDrawerItem: FC<{ to: string; children: ReactNode }> = ({ to, children }) => (
  <Link to={to} className={styles().classes.item}>
    {children}
  </Link>
);

const NavDrawer: FC<{ setOpen: (open: boolean) => void; open: boolean }> = ({ setOpen, open }) => {
  const theme = useMantineTheme();

  return (
    <Drawer
      opened={open}
      onClose={() => setOpen(false)}
      title="Navigation"
      size="md"
      styles={{
        header: {
          padding: "1rem",
          paddingBottom: 0,
        },
      }}
      overlayColor={theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2]}
      overlayOpacity={0.55}
      overlayBlur={3}
      transition="rotate-left"
    >
      <FlexDiv fullWidth gap0>
        <HomeNavItem />
        <NavDrawerItem to="/i18">Internationalization</NavDrawerItem>
      </FlexDiv>
    </Drawer>
  );
};

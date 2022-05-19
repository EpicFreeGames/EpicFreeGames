import { useMantineTheme, Drawer } from "@mantine/core";
import { FC } from "react";
import { FlexDiv } from "../../FlexDiv";
import { HomeNavItem, NavDrawerItem } from "./NavItem";

export const NavDrawer: FC<{ setOpen: (open: boolean) => void; open: boolean }> = ({
  setOpen,
  open,
}) => {
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
      <FlexDiv gap0 flexWrap>
        <HomeNavItem />
        <NavDrawerItem to="/i18">Internationalization</NavDrawerItem>
        <NavDrawerItem to="/commands">Commands</NavDrawerItem>
      </FlexDiv>
    </Drawer>
  );
};

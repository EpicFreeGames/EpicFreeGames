import { Button, useMantineColorScheme } from "@mantine/core";
import { MoonStars, Sun } from "tabler-icons-react";
import { buttonStyles } from "../Button";

export const ColorSchemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes } = buttonStyles();

  return (
    <Button
      onClick={() => toggleColorScheme()}
      p={"0.5rem"}
      variant="light"
      color={"gray"}
      className={classes.colorSchemeButton}
    >
      {colorScheme === "dark" ? <MoonStars size={20} /> : <Sun size={20} />}
    </Button>
  );
};

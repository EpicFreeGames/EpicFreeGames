import { createStyles } from "@mantine/core";

const transition = "all 0.2s ease-in-out";

export const buttonStyles = createStyles((theme) => ({
  button: {
    transition,
  },
  colorSchemeButton: {
    transition,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],
  },
}));

import { createStyles } from "@mantine/core";

export const useNavItemStyles = createStyles((theme) => ({
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

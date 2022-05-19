import { createStyles } from "@mantine/core";

export const useMenuBarStyles = createStyles((theme) => ({
  outer: {
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : "white",
    zIndex: 2,
    boxShadow: theme.colorScheme === "light" ? "0 0.5rem 1rem rgba(0, 0, 0, 0.04)" : "",
    paddingRight: "var(--removed-scroll-width)",
  },
  inner: {
    boxSizing: "border-box",
    flexShrink: 0,
    margin: "0 auto",
    padding: "0 0.7rem",
    maxWidth: "1200px",

    [theme.fn.largerThan("md")]: {
      padding: "0 25px",
    },
  },
  content: {
    height: "3.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",

    [theme.fn.largerThan("md")]: {
      height: "5rem",
      gap: "1rem",
    },
  },
}));

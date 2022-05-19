import { createStyles } from "@mantine/core";

export const useGamesStyles = createStyles((theme) => ({
  gamesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",

    [theme.fn.largerThan("xs")]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    },

    [theme.fn.largerThan("sm")]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
    },

    [theme.fn.largerThan("md")]: {
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: "0.7rem",
    },
  },
}));

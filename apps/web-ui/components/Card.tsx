import { createStyles, LoadingOverlay } from "@mantine/core";
import { FC, ReactNode } from "react";

export const cardStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    borderRadius: "8px",
    position: "relative",
  },
  lightCard: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : "white",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    borderRadius: "8px",
    position: "relative",
    width: "100%",
    height: "9rem",

    [theme.fn.largerThan("sm")]: {
      width: "calc(calc(100% - 2rem) / 5)",
    },
  },
  lightCardSkele: {
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    width: "100%",
    height: "9rem",

    [theme.fn.largerThan("sm")]: {
      width: "calc(calc(100% - 2rem) / 5)",
    },
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
    height: "100%",
  },
  cardLoadingOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
}));

interface Props {
  children: ReactNode;
  variant?: "light" | "dark";
  loading?: boolean;
}

export const Card: FC<Props> = ({ children, variant, loading }) => {
  const { classes } = cardStyles();

  const dark = variant === "dark";

  return (
    <div className={dark ? classes.card : classes.lightCard}>
      <LoadingOverlay visible={!!loading} className={classes.cardLoadingOverlay} />

      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

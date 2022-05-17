import { createStyles } from "@mantine/core";
import { FC, ReactNode } from "react";
import { Menubar } from "./Menubar/Menubar";

const useStyles = createStyles((theme) => ({
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    paddingTop: "3.5rem",
    paddingBottom: "1rem",
    zIndex: 1,

    [theme.fn.largerThan("xs")]: {
      paddingLeft: "0.7rem",
      paddingRight: "0.7rem",
      paddingTop: "4.5rem",
    },

    [theme.fn.largerThan("sm")]: {
      paddingLeft: "25px",
      paddingRight: "25px",
      paddingTop: "6rem",
    },
  },
}));

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { classes } = useStyles();

  return (
    <>
      <Menubar />
      <main className={classes.main}>{children}</main>
    </>
  );
};

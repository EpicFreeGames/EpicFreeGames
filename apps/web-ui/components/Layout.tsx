import { createStyles } from "@mantine/core";
import Head from "next/head";
import { FC, ReactNode } from "react";
import { Menubar } from "./Menubar/Menubar";
import { PageTitle } from "./Text";

const useStyles = createStyles((theme) => ({
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    paddingTop: "3.5rem",
    paddingBottom: "1rem",
    zIndex: 1,

    [theme.fn.largerThan("sm")]: {
      paddingLeft: "0.7rem",
      paddingRight: "0.7rem",
      paddingTop: "3.5rem",
    },

    [theme.fn.largerThan("md")]: {
      paddingLeft: "25px",
      paddingRight: "25px",
      paddingTop: "5rem",
    },
  },
}));

export const Layout: FC<{ children: ReactNode; title: string }> = ({ children, title }) => {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Menubar />

      <main className={classes.main}>
        <PageTitle>{title}</PageTitle>
        {children}
      </main>
    </>
  );
};

import { createStyles, Title } from "@mantine/core";
import Head from "next/head";
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
      paddingTop: "5rem",
    },
  },
  title: {
    padding: "0 1rem",

    [theme.fn.largerThan("xs")]: {
      padding: "1rem 0",
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
        <Title order={1} className={classes.title}>
          {title}
        </Title>
        {children}
      </main>
    </>
  );
};

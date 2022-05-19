import { createStyles } from "@mantine/core";
import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from "react";

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  children: ReactNode;
}

export const H1: FC<Props> = ({ children, ...props }) => (
  <h1 className={textStyles().classes.h1} {...props}>
    {children}
  </h1>
);
export const H2: FC<Props> = ({ children, ...props }) => (
  <h2 className={textStyles().classes.h2} {...props}>
    {children}
  </h2>
);
export const H3: FC<Props> = ({ children, ...props }) => (
  <h3 className={textStyles().classes.h3} {...props}>
    {children}
  </h3>
);

export const PageTitle: FC<Props> = ({ children }) => {
  const { classes, cx } = textStyles();

  return <h1 className={cx(classes.h1, classes.pageTitle)}>{children}</h1>;
};

export const CardTitle: FC<Props> = ({ children }) => {
  const { classes } = textStyles();

  return <h2 className={classes.h2}>{children}</h2>;
};

export const textStyles = createStyles((theme) => ({
  pageTitle: {
    padding: "0.7rem",

    [theme.fn.largerThan("sm")]: {
      padding: "1.5rem 0",
    },
  },
  h1: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    padding: "0.2rem 0",

    [theme.fn.largerThan("sm")]: {
      padding: "0.3rem 0",
      fontSize: "2rem",
    },
  },

  h2: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "0.2rem 0",

    [theme.fn.largerThan("sm")]: {
      fontSize: "1.4rem",
      padding: "0.3rem 0",
    },
  },

  h3: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    padding: "0.2rem 0",

    [theme.fn.largerThan("sm")]: {
      fontSize: "1.3rem",
      padding: "0.3rem 0",
    },
  },
}));

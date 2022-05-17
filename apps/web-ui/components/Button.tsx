import { createStyles, Button as MantineButton, ButtonProps } from "@mantine/core";

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

interface BtnProps extends ButtonProps<"button"> {
  flexGrow?: boolean;
}

export const Button = (props: BtnProps) => (
  <MantineButton
    {...props}
    className={`${props.className} ${buttonStyles().classes.button}`}
    style={{
      flexGrow: props.flexGrow ? 1 : undefined,
    }}
  />
);

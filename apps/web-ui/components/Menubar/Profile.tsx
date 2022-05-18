import { Button, Tooltip } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { buttonStyles } from "../Button";

export const Profile = () => {
  const { data } = useSession();
  const { classes } = buttonStyles();

  const logout = () => signOut({ redirect: false });
  const login = () => signIn("discord");

  return (
    <>
      {data ? (
        <Tooltip label="Logout" transition={"rotate-right"}>
          <Button className={classes.button} onClick={logout}>
            {data?.user?.name}
          </Button>
        </Tooltip>
      ) : (
        <Button className={classes.button} onClick={login}>
          Login
        </Button>
      )}
    </>
  );
};

import { Button } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { buttonStyles } from "../Button";
import { Tooltip } from "../Tooltip";

export const Profile = () => {
  const { data } = useSession();
  const { classes } = buttonStyles();

  const logout = () => signOut({ redirect: false });
  const login = () => signIn("discord");

  return (
    <>
      {data ? (
        <Tooltip label="Logout">
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

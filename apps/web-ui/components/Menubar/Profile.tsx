import { Button } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { buttonStyles } from "../Button";

export const Profile = () => {
  const { data } = useSession();
  const { classes } = buttonStyles();

  const logout = () => signOut({ redirect: false });
  const login = () => signIn("discord");

  return (
    <>
      <Button className={classes.button} onClick={data ? logout : login}>
        {data?.user?.name ? data.user.name : "Login"}
      </Button>
    </>
  );
};

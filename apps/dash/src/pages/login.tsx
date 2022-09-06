import { useRouter } from "next/router";
import { useEffect } from "react";

import { useUser } from "~hooks/useUser";
import { apiBaseUrl } from "~utils/envs";
import { Page } from "~utils/types";

const LoginPage: Page = () => {
  const { user, isLoading } = useUser(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (user) router.push("/");
  }, [user, isLoading]);

  return (
    <div className="mx-auto flex h-screen max-w-screen-lg flex-col items-center justify-center gap-14">
      <h1 className="text-5xl font-bold">Login</h1>

      <a
        className="btnBase border-[1px] border-blue-500 bg-blue-800/60 py-2 px-2 hover:bg-blue-700/80 active:bg-blue-600/80"
        href={`${apiBaseUrl}/auth/discord-init`}
      >
        Login with Discord
      </a>
    </div>
  );
};

LoginPage.requireAuth = false;
LoginPage.requiredFlags = [];

export default LoginPage;

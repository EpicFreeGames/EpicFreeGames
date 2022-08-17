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
    <div className="flex flex-col justify-center items-center gap-14 max-w-screen-lg mx-auto h-screen">
      <h1 className="font-bold text-5xl">Login</h1>

      <a
        className="btnBase py-2 px-2 border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
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

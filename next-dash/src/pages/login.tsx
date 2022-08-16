import { useRouter } from "next/router";
import { apiRequest } from "~utils/api/api";
import { dev, discordClientId, discordRedirectUrl } from "~utils/envs";

export default function LoginPage() {
  const queryParams = new URLSearchParams({
    client_id: discordClientId,
    redirect_uri: discordRedirectUrl,
    response_type: "code",
    scope: "identify",
  });

  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-14 max-w-screen-lg mx-auto h-screen">
      <h1 className="font-bold text-5xl">Login</h1>

      <a
        className="btnBase py-2 px-2 border-[1px] border-blue-500 bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
        href={`https://discord.com/api/oauth2/authorize?${queryParams.toString()}`}
      >
        Login with Discord
      </a>

      {dev && (
        <button
          onClick={async () => {
            await apiRequest("/auth/dev-login", "POST");
            router.push("/");
          }}
          className="btnBase py-2 px-2 border-[1px] border-green-500 bg-green-800/60 hover:bg-green-700/80 active:bg-green-600/80"
        >
          Dev login
        </button>
      )}
    </div>
  );
}

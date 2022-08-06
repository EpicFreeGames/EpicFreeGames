/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { h } from "preact";
import { tw } from "twind";
import { Base } from "~components/Layout/base.tsx";
import { config } from "~config";
import { api } from "~utils/api.ts";

type Data = {
  clientId: string;
  redirectUri: string;
  dev: boolean;
};

export const handler: Handlers<Data | null> = {
  GET: async (req, ctx) => {
    const cookies = getCookies(req.headers);
    // test cookie, if valid, redirect to /
    if (cookies.sid) {
      const { error } = await api({
        method: "GET",
        path: "/users/@me",
        auth: cookies.sid,
      });

      error && console.error(error);

      if (!error)
        return new Response("", {
          status: 303,
          headers: {
            Location: "/",
          },
        });
    }

    return ctx.render({
      clientId: config.DISCORD_CLIENT_ID,
      redirectUri: encodeURI(config.DISCORD_REDIRECT_URL),
      dev: config.ENV === "dev",
    });
  },
  ...(config.ENV === "dev" && {
    POST: async (req, ctx) => {
      const { error, response } = await api({
        method: "GET",
        path: `/auth/dev`,
      });

      if (error) return error;

      return new Response(null, {
        status: 303,
        headers: { Location: "/", "Set-Cookie": response.headers.get("Set-Cookie")! },
      });
    },
  }),
};

export default function Login({ data }: PageProps<Data>) {
  return (
    <Base title="Login">
      <div
        className={tw`flex flex-col justify-center items-center gap-14 max-w-screen-lg mx-auto h-screen`}
      >
        <h1 className={tw`font-bold text-5xl`}>Login</h1>

        <a
          className={tw`btn-blue-border`}
          href={`https://discord.com/api/oauth2/authorize?client_id=${data.clientId}&redirect_uri=${data.redirectUri}&response_type=code&scope=identify`}
        >
          Login with Discord
        </a>

        {data.dev && (
          <form method="post">
            <button type="submit" className={tw`btn-green-border`}>
              Dev login
            </button>
          </form>
        )}
      </div>
    </Base>
  );
}

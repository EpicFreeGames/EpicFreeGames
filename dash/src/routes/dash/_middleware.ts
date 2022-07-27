import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { api } from "../../utils/api.ts";

export type User = {
  id: string;
  discordId: string;
  name: string;
  flags: number;
};

export type State = {
  user: User | null;
};

export const handler = async (req: Request, ctx: MiddlewareHandlerContext<State>) => {
  const path = new URL(req.url).pathname;

  if (path === "/dash/login") return ctx.next();

  const cookies = getCookies(req.headers);

  if (!cookies.sid)
    return new Response("", {
      status: 303,
      headers: {
        location: "/dash/login",
      },
    });

  const { error, data: user } = await api<User>({
    method: "GET",
    path: "/users/@me",
    auth: cookies.sid,
  });

  error && console.error(error);

  if (!user || error)
    return new Response("", {
      status: 303,
      headers: {
        location: "/dash/login",
      },
    });

  ctx.state.user = user;

  return ctx.next();
};

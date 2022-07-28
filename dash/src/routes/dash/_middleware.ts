import { getCookies } from "$std/http/cookie.ts";
import { User } from "../../types.ts";
import { api } from "../../utils/api.ts";
import { MiddlewareHandlerContext } from "../../utils/freshTypes.ts";

export const handler = async (req: Request, ctx: MiddlewareHandlerContext) => {
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

  ctx.state = {
    user,
    auth: cookies.sid,
  };

  return ctx.next();
};

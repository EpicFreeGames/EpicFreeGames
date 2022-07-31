import { getCookies } from "$std/http/cookie.ts";
import { MiddlewareHandlerContext } from "../utils/freshTypes.ts";

export const handler = (req: Request, ctx: MiddlewareHandlerContext) => {
  const path = new URL(req.url).pathname;

  if (path === "/login" || path === "/discord-callback") return ctx.next();

  const cookies = getCookies(req.headers);

  if (!cookies.sid)
    return new Response("", {
      status: 303,
      headers: {
        location: "/login",
      },
    });

  ctx.state = {
    auth: cookies.sid,
  };

  return ctx.next();
};

import { getCookies } from "$std/http/cookie.ts";

import { api } from "../utils/api.ts";
import { Handlers } from "../utils/freshTypes.ts";

export const handler: Handlers = {
  GET: async (req, res) => {
    const cookies = getCookies(req.headers);
    const auth = cookies.sid;

    if (auth) {
      await api({
        method: "POST",
        path: "/auth/logout",
        auth: auth,
      });
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/login",
        "Set-Cookie": "sid=;",
      },
    });
  },
};

/** @jsx h */
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";
import { IUser } from "../types.ts";

export const handler: Handlers = {
  GET: async (req, _ctx) => {
    const code = new URL(req.url).searchParams.get("code");

    const { error, response } = await api<IUser & { sid: string }>({
      method: "GET",
      path: `/auth/discord?code=${code}`,
    });

    if (error) return error;

    return new Response(null, {
      status: 303,
      headers: { Location: "/", "Set-Cookie": response.headers.get("Set-Cookie")! },
    });
  },
};

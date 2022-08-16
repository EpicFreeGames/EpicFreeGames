import { IncomingMessage } from "http";
import redis from "../data/redis";
import { Flags } from "./flags";
import { verifyAccessJwt } from "./jwt/jwt";
import { hasPermission } from "./perms";

export const socketAuth = async (req: IncomingMessage) => {
  const accessTokenCookie = req.headers.cookie?.split("access-token=")?.at(1);
  if (!accessTokenCookie) return { hasAccess: false };

  const accessTokenPayload = await verifyAccessJwt(accessTokenCookie);
  if (!accessTokenPayload) return { hasAccess: false };

  if (!hasPermission(accessTokenPayload.flags, [Flags.ReceiveEvents])) return { hasAccess: false };

  const tokenExists = await redis.sismember(
    `${accessTokenPayload.userId}:tokens`,
    accessTokenPayload.jti
  );

  return { hasAccess: !!tokenExists, accessTokenPayload };
};

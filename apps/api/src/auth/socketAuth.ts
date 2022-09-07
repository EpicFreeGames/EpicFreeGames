import { IncomingMessage } from "http";

import prisma from "../data/prisma";
import { hasPermission } from "./authUtils";
import { Flags } from "./flags";
import { verifyAccessJwt } from "./jwt/jwt";

export const socketAuth = async (req: IncomingMessage) => {
  const accessTokenCookie = req.headers.cookie?.split("access-token=")?.at(1);
  if (!accessTokenCookie) return { hasAccess: false };

  const accessTokenPayload = await verifyAccessJwt(accessTokenCookie);
  if (!accessTokenPayload) return { hasAccess: false };

  const user = await prisma.user.findUnique({ where: { id: accessTokenPayload.userId } });

  if (!user) return { hasAccess: false };
  if (accessTokenPayload.jti !== user.tokenVersion) return { hasAccess: false };
  if (user.flags !== accessTokenPayload.flags) return { hasAccess: false };

  if (!hasPermission(accessTokenPayload.flags, [Flags.ReceiveEvents])) return { hasAccess: false };

  return { hasAccess: true, accessTokenPayload };
};

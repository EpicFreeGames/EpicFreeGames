import { config } from "../config";
import { Middleware } from "../types";
import { safeEqual } from "../utils/crypto";
import { Flags } from "./flags";
import { verifyAccessJwt } from "./jwt";
import { hasPermission } from "./perms";

export const endpointAuth =
  (...requiredFlags: Flags[]): Middleware =>
  async (req, res, next) => {
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    const accessTokenCookie = req.cookies["access-token"];

    if ((!accessTokenCookie && !authHeader) || Array.isArray(authHeader))
      return res.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid auth",
      });

    const botToken = authHeader?.split("Bot ")?.at(1);
    if (botToken && safeEqual(botToken, config.EFG_API_BOT_SECRET)) return next();

    const accessTokenPayload = await verifyAccessJwt(accessTokenCookie);

    if (!accessTokenPayload)
      return res.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Token is invalid or has expired",
      });

    if (!hasPermission(accessTokenPayload.flags, requiredFlags))
      return res.status(403).json({
        statusCode: 403,
        error: "Forbidden",
        message: "Insufficient permissions",
      });

    req.tokenPayload = accessTokenPayload;

    next();
  };

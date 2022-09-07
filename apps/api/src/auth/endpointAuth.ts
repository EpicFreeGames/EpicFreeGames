import { bots } from "../data/bots";
import prisma from "../data/prisma";
import { Middleware } from "../types";
import { safeEqual } from "../utils/crypto";
import { hasPermission } from "./authUtils";
import { createAccessTokenCookie } from "./cookie";
import { Flags } from "./flags";
import { createAccessToken, verifyAccessJwt } from "./jwt/jwt";

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
    const bearerToken = authHeader?.split("Bearer ")?.at(1);

    const authToken = bearerToken || botToken || accessTokenCookie;
    if (!authToken)
      return res.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid auth",
      });

    if (botToken) {
      for (const bot of bots) {
        if (safeEqual(bot.token, authToken) && hasPermission(bot.flags, requiredFlags)) {
          req.user = { identifier: bot.identifier, flags: bot.flags };

          return next();
        }
      }

      return res.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid token",
      });
    } else {
      const accessTokenPayload = await verifyAccessJwt(authToken);

      if (!accessTokenPayload)
        return res.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid token",
        });

      const user = await prisma.user.findUnique({ where: { id: accessTokenPayload.userId } });

      if (!user)
        return res.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "User not found",
        });

      if (accessTokenPayload.jti !== user.tokenVersion)
        return res.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid token",
        });

      if (user.flags !== accessTokenPayload.flags)
        return res.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid token",
        });

      if (!hasPermission(accessTokenPayload.flags, requiredFlags))
        return res.status(403).json({
          statusCode: 403,
          error: "Forbidden",
          message: "Insufficient permissions",
        });

      req.tokenPayload = accessTokenPayload;
      req.user = user;

      // refresh expiry
      const newAccessToken = await createAccessToken(accessTokenPayload);
      res.setHeader("Set-Cookie", createAccessTokenCookie(newAccessToken));

      next();
    }
  };

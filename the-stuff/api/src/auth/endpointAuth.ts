import { Middleware } from "../types";
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

    const authToken = authHeader?.split("Bearer ")?.at(1) ?? accessTokenCookie;
    if (!authToken)
      return res.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid auth",
      });

    const accessTokenPayload = await verifyAccessJwt(authToken);

    if (!accessTokenPayload)
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

    const { jti, ...rest } = accessTokenPayload;

    // refresh expiry
    const newAccessToken = await createAccessToken(rest, jti);
    res.setHeader("Set-Cookie", createAccessTokenCookie(newAccessToken));

    next();
  };

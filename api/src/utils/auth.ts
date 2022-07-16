import { config } from "../config";
import { Middleware } from "../types";
import { safeEqual } from "./crypto";
import { Flags } from "./flags";

export const auth =
  (...requiredFlags: Flags[]): Middleware =>
  async (req, res, next) => {
    const botToken = req.headers.authorization?.split("Bot ")?.at(1);

    if (!botToken || !req.session?.flags)
      return res.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "No auth provided",
      });

    if (botToken && safeEqual(botToken, config.BOT_SECRET)) return next();

    if (!hasPermission(req.session.flags, requiredFlags))
      return res.status(403).json({
        statusCode: 403,
        error: "Forbidden",
        message: "Insufficient permissions",
      });

    next();
  };

const hasPermission = (flags: number, requiredFlags: Flags[]) => {
  if (hasFlag(flags, Flags.ADMIN)) return true;

  const totalRequired = requiredFlags.reduce((acc, flag) => acc | flag);

  return hasFlag(flags, totalRequired);
};

const hasFlag = (flags: number, requiredFlag: Flags) =>
  (flags & requiredFlag) === requiredFlag;

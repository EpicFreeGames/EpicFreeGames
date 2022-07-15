import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { Flags } from "./flags";
import { verifyAccessJwt } from "./jwt";

export const auth =
  (...requiredFlags: Flags[]) =>
  async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    const token = request.headers["authorization"]?.split("Bearer ").at(1);
    if (!token)
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "No token provided",
      });

    const accessToken = await verifyAccessJwt(token);

    if (!accessToken)
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Token is invalid or has expired",
      });

    if (!hasPermission(accessToken.flags, requiredFlags))
      return reply.status(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "Insufficient permissions",
      });
  };

const hasPermission = (flags: number, requiredFlags: Flags[]) => {
  if (hasFlag(flags, Flags.ADMIN)) return true;

  const totalRequired = requiredFlags.reduce((acc, flag) => acc | flag);

  return hasFlag(flags, totalRequired);
};

const hasFlag = (flags: number, requiredFlag: Flags) =>
  (flags & requiredFlag) === requiredFlag;

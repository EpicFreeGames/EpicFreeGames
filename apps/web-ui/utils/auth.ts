import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { forbidden, unauthorized } from "./apiUtils";
import { nextAuthSecret } from "./envs";

export const hasAccess = async (
  req: NextApiRequest,
  res: NextApiResponse,
  requireAdmin: boolean
) => {
  const token = await getToken({ req, secret: nextAuthSecret });

  if (!token) {
    unauthorized(res);
    return false;
  }

  const isAdmin = token.isAdmin;
  const isCollaborator = token.isCollaborator;

  if (requireAdmin && !isAdmin) {
    forbidden(res);
    return false;
  }

  if (!isAdmin && !isCollaborator) {
    forbidden(res);
    return false;
  }

  return true;
};

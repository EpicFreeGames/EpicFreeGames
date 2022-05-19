import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { forbidden, unauthorized } from "./apiUtils";
import { adminId, collaborators, nextAuthSecret } from "./envs";

export const hasAccess = async (
  req: NextApiRequest,
  res: NextApiResponse,
  requireAdmin: boolean
) => {
  const token = await getToken({ req, secret: nextAuthSecret });

  const userId = token?.sub || "";

  if (!userId) {
    unauthorized(res);
    return false;
  }

  const isAdmin = userId === adminId;
  const isCollaborator = collaborators.includes(userId);

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

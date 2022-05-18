import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { adminId, collaborators, nextAuthSecret } from "./envs";

const unauthorized = (res: NextApiResponse) => res.status(401).json({ message: "Unauthorized" });
const forbidden = (res: NextApiResponse) => res.status(403).json({ message: "Forbidden" });

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

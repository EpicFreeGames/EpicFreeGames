import { NextApiRequest, NextApiResponse } from "next";

export const unauthorized = (res: NextApiResponse) =>
  res.status(401).json({ message: "Unauthorized" });
export const forbidden = (res: NextApiResponse) => res.status(403).json({ message: "Forbidden" });

export const methodNotAllowed = (res: NextApiResponse) =>
  res.status(405).json({ message: "Method not allowed" });

export const requireMethod = (method: string) => (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== method) {
    methodNotAllowed(res);
    return false;
  }

  return true;
};

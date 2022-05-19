import { NextApiRequest, NextApiResponse } from "next";

export interface ApiEndpoint {
  (req: NextApiRequest, res: NextApiResponse): any;
}

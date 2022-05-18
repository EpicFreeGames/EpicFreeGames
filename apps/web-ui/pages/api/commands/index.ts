import { NextApiRequest, NextApiResponse } from "next";
import { updateCommands } from "../../../utils/requests/Commands";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case "POST":
      await HandlePost(req, res);
      break;

    default:
      res.status(405).json({ message: `Method '${method}' not allowed` });
      break;
  }
};

const HandlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await updateCommands();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default Handler;

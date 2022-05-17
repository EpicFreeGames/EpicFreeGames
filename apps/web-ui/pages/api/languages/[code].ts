import { NextApiRequest, NextApiResponse } from "next";
import { db } from "shared";

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "PATCH":
      HandlePatch(req, res);
      break;

    case "DELETE":
      HandleDelete(req, res);
      break;

    default:
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
};

const HandlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const body = JSON.parse(req.body);
  const { code } = req.query;

  if (body.code !== code) {
    const language = await db.languages.get.byCode(body.code);

    if (language)
      return res.status(400).json({
        message: `Language with code '${body.code}' already exists`,
      });
  }

  const updatedLanguage = await db.languages.update(code as string, JSON.parse(req.body));
  if (!updatedLanguage)
    return res.status(400).json({
      message: `Language with code '${code}' doesn't exist`,
    });

  res.status(200).json({
    ...updatedLanguage,
    guildCount: await db.guilds.get.counts.hasLanguage(updatedLanguage.code),
  });
};

const HandleDelete = async (req: NextApiRequest, res: NextApiResponse) => {};

export default Handler;

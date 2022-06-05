import { NextApiRequest, NextApiResponse } from "next";
import { getDefaultLanguage } from "shared";
import { db } from "database";
import { hasAccess } from "../../../utils/auth";
import { dbConnect } from "../../../utils/db";
import { methodNotAllowed } from "../../../utils/apiUtils";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "PATCH":
      if (!(await hasAccess(req, res, true))) break;

      await HandlePatch(req, res);
      break;

    default:
      methodNotAllowed(res);
      break;
  }
};

const HandlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const body = req.body;
  const { code } = req.query;

  if (getDefaultLanguage().code === code)
    return res.status(400).json({ message: "Default language can't be edited" });

  if (body.code !== code) {
    const language = await db.languages.get.byCode(body.code);

    if (language)
      return res.status(400).json({
        message: `Language with code '${body.code}' already exists`,
      });
  }

  const updatedLanguage = await db.languages.update(code as string, body);
  if (!updatedLanguage)
    return res.status(400).json({
      message: `Language with code '${code}' doesn't exist`,
    });

  res.status(200).json({
    ...updatedLanguage,
    guildCount: await db.guilds.get.counts.hasLanguage(updatedLanguage.code),
  });

  await db.games.markToBeRevalidated();
};

export default Handler;

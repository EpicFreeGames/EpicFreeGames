import { NextApiRequest, NextApiResponse } from "next";
import { ILanguageWithGuildCount, getDefaultLanguage } from "shared";
import { hasAccess } from "../../../utils/auth";
import { dbConnect } from "../../../utils/db";
import { db } from "database";
import { methodNotAllowed } from "../../../utils/apiUtils";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      if (!(await hasAccess(req, res, false))) break;

      await HandleGet(req, res);
      break;

    case "POST":
      if (!(await hasAccess(req, res, true))) break;

      await HandlePost(req, res);
      break;

    default:
      methodNotAllowed(res);
      break;
  }
};

const HandlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const body = JSON.parse(req.body);

  const language =
    getDefaultLanguage().code === body.code || (await db.languages.get.byCode(body.code));

  if (language) {
    res.status(400).json({
      message: `Language with code '${body.code}' already exists`,
    });
    return;
  }

  const createdLanguage = await db.languages.create(JSON.parse(req.body));

  res.status(201).json({
    ...createdLanguage,
    guildCount: 0,
  });

  await db.games.markToBeRevalidated();
};

const HandleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const languages = await db.languages.get.all();

  const languagesWithGuildCounts: ILanguageWithGuildCount[] = await Promise.all(
    languages.map(async (l) => ({
      ...l,
      guildCount: await db.guilds.get.counts.hasLanguage(l.code),
    }))
  );

  const defaultLangStats: ILanguageWithGuildCount = {
    ...getDefaultLanguage(),
    guildCount: await db.guilds.get.counts.hasDefaultLanguage(),
    isDefault: true,
  };

  res.status(200).json([...languagesWithGuildCounts, defaultLangStats]);
};

export default Handler;

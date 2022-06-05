import { NextApiRequest, NextApiResponse } from "next";
import { ICurrencyWithGuildCount, getDefaultCurrency } from "shared";
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

  const body = req.body;

  const currency =
    getDefaultCurrency().code === body.code || (await db.currencies.get.byCode(body.code));

  if (currency) {
    res.status(400).json({
      message: `Currency with code '${body.code}' already exists`,
    });
    return;
  }

  const createdCurrency = await db.currencies.create(body);

  res.status(201).json({
    ...createdCurrency,
    guildCount: 0,
  });

  await db.games.markToBeRevalidated();
};

const HandleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const currency = await db.currencies.get.all();

  const currenciesWithGuildCounts: ICurrencyWithGuildCount[] = await Promise.all(
    currency.map(async (c) => ({
      ...c,
      guildCount: await db.guilds.get.counts.hasCurrency(c.code),
    }))
  );

  const defaultLangStats: ICurrencyWithGuildCount = {
    ...getDefaultCurrency(),
    guildCount: await db.guilds.get.counts.hasDefaultCurrency(),
    isDefault: true,
  };

  res.status(200).json([...currenciesWithGuildCounts, defaultLangStats]);
};

export default Handler;

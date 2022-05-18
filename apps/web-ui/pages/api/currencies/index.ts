import { NextApiRequest, NextApiResponse } from "next";
import { db, ICurrencyWithGuildCount } from "shared";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      await HandleGet(req, res);
      break;

    case "POST":
      await HandlePost(req, res);
      break;

    default:
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
};

const HandlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const body = JSON.parse(req.body);

  const currency = await db.currencies.get.byCode(body.code);

  if (currency) {
    res.status(400).json({
      message: `Currency with code '${body.code}' already exists`,
    });
    return;
  }

  const createdCurrency = await db.currencies.create(JSON.parse(req.body));

  res.status(201).json({
    ...createdCurrency,
    guildCount: 0,
  });
};

const HandleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const currency = await db.currencies.get.all();

  const currenciesWithGuildCounts: ICurrencyWithGuildCount[] = await Promise.all(
    currency.map(async (c) => ({
      ...c,
      guildCount: await db.guilds.get.counts.hasCurrency(c.code),
    }))
  );

  res.status(200).json(currenciesWithGuildCounts);
};

export default Handler;

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "shared";

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "PATCH":
      HandlePatch(req, res);
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
    const currency = await db.currencies.get.byCode(body.code);

    if (currency)
      return res.status(400).json({
        message: `Currency with code '${body.code}' already exists`,
      });
  }

  const updatedCurrency = await db.currencies.update(code as string, JSON.parse(req.body));
  if (!updatedCurrency)
    return res.status(400).json({
      message: `Currency with code '${code}' doesn't exist`,
    });

  res.status(200).json({
    ...updatedCurrency,
    guildCount: await db.guilds.get.counts.hasCurrency(updatedCurrency.code),
  });
};

export default Handler;

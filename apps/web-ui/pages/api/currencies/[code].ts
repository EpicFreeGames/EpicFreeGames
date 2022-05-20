import { NextApiRequest, NextApiResponse } from "next";
import { getDefaultCurrency } from "shared";
import { hasAccess } from "../../../utils/auth";
import { dbConnect } from "../../../utils/db";
import { db } from "database";
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

  const body = JSON.parse(req.body);
  const { code } = req.query;

  if (getDefaultCurrency().code === code)
    return res.status(400).json({ message: "Default currency can't be edited" });

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

  await db.games.markToBeRevalidated();
};

export default Handler;

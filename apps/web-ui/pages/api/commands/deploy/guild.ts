import { NextApiRequest, NextApiResponse } from "next";
import { getDefaultCurrency, getDefaultLanguage } from "shared";
import { hasAccess } from "../../../../utils/auth";
import { getCommandsToDeploy, guildDeploy } from "../../../../utils/commandDeploy";
import { dbConnect } from "../../../../utils/db";
import { db } from "database";
import { requireMethod } from "../../../../utils/apiUtils";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!requireMethod("POST")) return;

  if (!(await hasAccess(req, res, true))) return;

  try {
    await dbConnect();

    const dbLanguages = await db.languages.get.all();
    const dbCurrencies = await db.currencies.get.all();

    const languages = [...dbLanguages, getDefaultLanguage()];
    const currencies = [...dbCurrencies, getDefaultCurrency()];

    const { guildCommands } = await getCommandsToDeploy(languages, currencies);

    await guildDeploy(guildCommands);

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default Handler;
